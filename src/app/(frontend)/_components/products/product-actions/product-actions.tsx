"use client";

import type { Product } from "@/payload-types";

import { Button } from "@medusajs/ui";
import { useMemo, useState } from "react";
import { useCart } from "react-use-cart";

import Divider from "../../divider";
import ProductPrice from "../product-price/product-price";
import OptionSelect from "./option-select";

type ProductActionsProps = {
    product: Product;
    selectedOptions: Record<string, string>;
    setSelectedOptions: React.Dispatch<
        React.SetStateAction<Record<string, string>>
    >;
};

export default function ProductActions({
    product,
    selectedOptions,
    setSelectedOptions,
}: ProductActionsProps) {
    const [isAdding, setIsAdding] = useState(false);
    const { addItem } = useCart();

    const options = useMemo(() => {
        const optionsMap = new Map();

        for (const { options } of product.variants || []) {
            for (const { option, value } of options || []) {
                if (!optionsMap.has(option)) {
                    optionsMap.set(option, new Set());
                }
                optionsMap.get(option).add(value);
            }
        }

        return Array.from(optionsMap.entries()).map(([option, values]) => ({
            name: option,
            values: Array.from(values),
        }));
    }, [product.variants]) as Array<{
        name: string;
        values: string[];
    }>;

    const allOptionsSelected = useMemo(() => {
        return options.every(({ name }) => selectedOptions[name]);
    }, [options, selectedOptions]);

    const handleAddToCart = () => {
        setIsAdding(true);

        const selectedVariant = product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        );

        if (selectedVariant?.id == null) {
            return;
        }

        const newItem = {
            ...selectedVariant,
            id: `${selectedVariant.id}`,
            currency: product.currency,
            gallery: selectedVariant.gallery?.length
                ? selectedVariant.gallery
                : product.variants[0].gallery,
            handle: product.handle,
            productName: product.title,
        };

        setTimeout(() => {
            addItem(newItem, 1);
            setIsAdding(false);
        }, 200);
    };

    const selectedVariant =
        product.variants?.find((variant) =>
            variant.options?.every(
                (opt) => selectedOptions[opt.option] === opt.value
            )
        ) || product.variants[0];

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex flex-col gap-y-4">
                {options.map(({ name, values }) => (
                    <OptionSelect
                        data-testid="product-options"
                        key={name}
                        optionName={name}
                        options={selectedOptions[name]}
                        optionValue={values}
                        title={name}
                        updateOption={(option, value) => {
                            setSelectedOptions((prev) => ({
                                ...prev,
                                [option]: value,
                            }));
                        }}
                    />
                ))}
                <Divider />
            </div>

            <ProductPrice
                currency={product.currency}
                showFrom={product.variants.length > 1 && !allOptionsSelected}
                variant={selectedVariant}
            />

            <Button
                className="w-full h-10"
                data-testid="add-product-button"
                disabled={isAdding || !allOptionsSelected}
                isLoading={isAdding}
                onClick={handleAddToCart}
                variant="primary"
            >
                {allOptionsSelected ? "Add to cart" : "Select variant"}
            </Button>
        </div>
    );
}
