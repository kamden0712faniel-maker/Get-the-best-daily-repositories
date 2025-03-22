<?php

namespace SoloTerm\Screen\Buffers;

/**
 * @mixin Buffer
 */
class Proxy
{
    protected array $items;

    public function __construct(array $items)
    {
        $this->items = $items;
    }

    public function __call($method, $parameters): void
    {
        foreach ($this->items as $item) {
            $item->{$method}(...$parameters);
        }
    }
}
