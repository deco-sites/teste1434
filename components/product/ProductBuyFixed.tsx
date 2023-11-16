import { IS_BROWSER } from "$fresh/runtime.ts";
import type { Product } from "apps/commerce/types.ts";
import calcOFF from "$store/sdk/calcOFF.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";

import AddToCartButtonVTEX from "$store/islands/AddToCartButton/vtex.tsx";
import WishlistButton from "$store/components/wishlist/WishlistButton.tsx";
import { useSignal } from "@preact/signals";

interface Props {
  product: Product;
  hide?: {
    installments?: boolean;
    ratings?: boolean;
    productQuantityCartAndShipping?: boolean;
  };
  textFixedBuy?: string;
}

const QUANTITY_MAX_VALUE = 99;

export default function ProductBuyFixed({ product, hide }: Props) {
  const { offers, name = "", productID, isVariantOf } = product;
  const { price = 0, listPrice, seller, pureInstallments } = useOffer(offers);
  const quantity = useSignal(1);

  const productGroupID = isVariantOf?.productGroupID ?? "";
  const discount = price && listPrice ? listPrice - price : 0;
  const billingDuration = pureInstallments?.billingDuration ?? 0;
  const billingIncrement = pureInstallments?.billingIncrement ?? 0;

  if (IS_BROWSER) {
    const $buyFixed = document.getElementById("product-buy-fixed");

    if (window.innerWidth < 1024) {
      $buyFixed?.setAttribute("data-show", "true");
    } else {
      self.addEventListener("scroll", () => {
        if (self.scrollY > 400) {
          $buyFixed?.setAttribute("data-show", "true");
        } else if ($buyFixed?.getAttribute("data-show") !== "false") {
          $buyFixed?.setAttribute("data-show", "false");
        }
      });
    }
  }

  const handleChangeQuantity = (value: number) => {
    if (value > QUANTITY_MAX_VALUE || value < 1) return;

    quantity.value = value;
  };

  return (
    <div
      id={"product-buy-fixed"}
      class="w-full fixed left-0 bottom-0 pointer-events-none opacity-0 data-[show=true]:opacity-100 data-[show=true]:pointer-events-auto z-20 bg-white transition-opacity"
    >
      <div class={"w-full h-6 bg-primary-600 flex justify-center items-center "}>
        <span class={"text-white text-xs font-bold font-tt-norms"}>FRETE GRÁTIS acima de 149,90 | 5%OFF no PIX</span>
      </div>

      <div class="container max-w-[1296px] w-full font-tt-norms h-[84px] px-5 lg:h-[55px]">
        <div class="flex w-full h-full items-center justify-between gap-3 lg:gap-6">
          <div class="flex flex-col lg:flex-row">
            {(300 ?? 0) > price && (
              <div class="flex lg:flex-col-reverse lg:mr-8 items-center lg:items-start">
                <span class="text-sm font-light text-neutral-3 line-through font-tt-norms">
                  {formatPrice(listPrice, offers!.priceCurrency!)}
                </span>
                <span class="ml-2 lg:ml-0 w-[77px] h-[24px] bg-primary-400 flex items-center justify-center font-tt-norms text-xs font-bold text-white rounded-full">
                  -{calcOFF(listPrice ?? 0, price).toFixed(0)}% OFF
                </span>
              </div>
            )}
            <div class="flex flex-col lg:flex-row lg:items-end">
              <span class="text-2xl font-bold text-black font-tt-norms">
                {formatPrice(price, offers!.priceCurrency!)}
              </span>
              {!hide?.installments && (
                <span class="text-xs lg:text-sm text-primary-500 font-tt-norms font-bold ml-1 whitespace-nowrap">
                  ou {billingDuration}x de {formatPrice(billingIncrement)} SEM JUROS
                </span>
              )}
            </div>
          </div>

          <div class={"w-full flex justify-end"}>
            {!hide?.productQuantityCartAndShipping && (
              <div class="max-lg:ml-auto mr-6 lg:mr-14 max-w-[108px] lg:max-w-[334px] w-full flex items-center">
                <AddToCartButtonVTEX
                  name={name}
                  productID={productID}
                  productGroupID={productGroupID}
                  price={price}
                  discount={discount}
                  seller={seller ?? ""}
                  quantity={quantity.value}
                  class={
                    "lg:rounded-r-none h-[45px] w-full max-w-[108px] lg:max-w-[204px] rounded border border-none bg-client-primary hover:bg-client-primary-dark transition-colors font-medium text-white text-base"
                  }
                />

                <div
                  class={
                    "hidden lg:flex justify-center items-center rounded-r-[4px]  w-[130px] h-[45px] border border-l-0 border-neutral-2 overflow-hidden gap-3"
                  }
                >
                  <button
                    onClick={() => handleChangeQuantity(quantity.value - 1)}
                    class={
                      "flex items-center justify-center w-6 h-7 outline-none bg-transparent text-2xl text-neutral-2 font-bold"
                    }
                  >
                    -
                  </button>
                  <input
                    class="w-5 h-[45px] text-center text-neutral-2 text-sm outline-none bg-transparent"
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    max={QUANTITY_MAX_VALUE}
                    min={1}
                    value={quantity}
                    onBlur={(e) => handleChangeQuantity?.(e.currentTarget.valueAsNumber)}
                    maxLength={3}
                    size={3}
                  />
                  <button
                    class={
                      "flex items-center justify-center w-6 h-7 outline-none bg-transparent text-2xl text-neutral-2 font-bold"
                    }
                    onClick={() => handleChangeQuantity(quantity.value + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <WishlistButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
