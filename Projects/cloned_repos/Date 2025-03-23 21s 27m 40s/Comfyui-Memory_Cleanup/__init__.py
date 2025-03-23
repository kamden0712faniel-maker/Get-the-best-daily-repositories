import psutil
import ctypes
from ctypes import wintypes
import time

class AnyType(str):
    """用于表示任意类型的特殊类，在类型比较时总是返回相等"""
    def __eq__(self, _) -> bool:
        return True

    def __ne__(self, __value: object) -> bool:
        return False

any = AnyType("*")

class VRAMCleanup:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "anything": (any, {}),
                "offload_model": ("BOOLEAN", {"default": True}),
                "offload_cache": ("BOOLEAN", {"default": True}),
            },
            "optional": {},
            "hidden": {
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            }
        }

    RETURN_TYPES = (any,)
    RETURN_NAMES = ("output",)
    OUTPUT_NODE = True
    FUNCTION = "empty_cache"
    CATEGORY = "Memory Management"

    def empty_cache(self, anything, offload_model, offload_cache, unique_id=None, extra_pnginfo=None):
        try:
            if offload_model:
                import comfy.model_management
                comfy.model_management.unload_all_models()
            if offload_cache:
                import torch
                import gc
                torch.cuda.empty_cache()
                gc.collect()
        except Exception as e:
            print(f"内存清理出错: {str(e)}")
            import traceback
            print(traceback.format_exc())
            
        return (anything,)
    

class RAMCleanup:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "anything": (any, {}),
                "clean_file_cache": ("BOOLEAN", {"default": True, "label": "清理文件缓存"}),
                "clean_processes": ("BOOLEAN", {"default": True, "label": "清理进程内存"}),
                "clean_dlls": ("BOOLEAN", {"default": True, "label": "清理未使用DLL"}),
                "retry_times": ("INT", {
                    "default": 3, 
                    "min": 1, 
                    "max": 10, 
                    "step": 1,
                    "label": "重试次数"
                }),
            },
            "optional": {},
            "hidden": {
                "unique_id": "UNIQUE_ID",
                "extra_pnginfo": "EXTRA_PNGINFO",
            }
        }

    RETURN_TYPES = (any,)
    RETURN_NAMES = ("output",)
    OUTPUT_NODE = True
    FUNCTION = "clean_ram"
    CATEGORY = "Memory Management"

    def get_ram_usage(self):
        memory = psutil.virtual_memory()
        return memory.percent, memory.available / (1024 * 1024) 

    def clean_ram(self, anything, clean_file_cache, clean_processes, clean_dlls, retry_times, unique_id=None, extra_pnginfo=None):
        try:
            current_usage, available_mb = self.get_ram_usage()
            print(f"开始清理RAM - 当前使用率: {current_usage:.1f}%, 可用: {available_mb:.1f}MB")
            
            for attempt in range(retry_times):
                
                if clean_file_cache:
                    try:
                        ctypes.windll.kernel32.SetSystemFileCacheSize(-1, -1, 0)
                    except Exception as e:
                        print(f"清理文件缓存失败: {str(e)}")
                        
                if clean_processes:
                    cleaned_processes = 0
                    for process in psutil.process_iter(['pid', 'name']):
                        try:
                            handle = ctypes.windll.kernel32.OpenProcess(
                                wintypes.DWORD(0x001F0FFF),
                                wintypes.BOOL(False),
                                wintypes.DWORD(process.info['pid'])
                            )
                            ctypes.windll.psapi.EmptyWorkingSet(handle)
                            ctypes.windll.kernel32.CloseHandle(handle)
                            cleaned_processes += 1
                        except:
                            continue

                if clean_dlls:
                    try:
                        ctypes.windll.kernel32.SetProcessWorkingSetSize(-1, -1, -1)
                    except Exception as e:
                        print(f"释放DLL失败: {str(e)}")

                time.sleep(1)
                current_usage, available_mb = self.get_ram_usage()
                print(f"清理后内存使用率: {current_usage:.1f}%, 可用: {available_mb:.1f}MB")

            print(f"清理完成 - 最终内存使用率: {current_usage:.1f}%, 可用: {available_mb:.1f}MB")

        except Exception as e:
            print(f"RAM清理过程出错: {str(e)}")
            
        return (anything,)
    
NODE_CLASS_MAPPINGS = {
    "VRAMCleanup": VRAMCleanup,
    "RAMCleanup": RAMCleanup,

}
NODE_DISPLAY_NAME_MAPPINGS = {
    "VRAMCleanup": "🎈VRAM-Cleanup",
    "RAMCleanup": "🎈RAM-Cleanup",
}
