import { SendEventOnLoad } from "$store/components/Analytics.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import calcOFF from "$store/sdk/calcOFF.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { BreadcrumbList, Product, ProductDetailsPage, ProductGroup } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { asset } from "$fresh/runtime.ts";
import AddToCartButtonVTEX from "$store/islands/AddToCartButton/vtex.tsx";
import WishlistButton from "$store/components/wishlist/WishlistButton.tsx";
import ProductSpecifications from "deco-sites/dabelleultimate/components/product/ProductSpecifications.tsx";

export type Video = {
  value: string;
  thumbnail: string;
};

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
  id?: string;
}

const WIDTH = 360;
const HEIGHT = 360;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

/**
 * Rendered when a not found is returned by any of the loaders run on this page
 */

export const findAdditionalProperty = (names: string[], isVariantOf?: ProductGroup) => {
  if (!isVariantOf) return [];
  return isVariantOf.additionalProperty.filter((property) => names.includes(property.name!));
};

function ProductInfo({
  product,
  breadcrumbList,
  hide = {},
  id,
  partial,
}: {
  product: Product;
  breadcrumbList?: BreadcrumbList;
  variant?: "quickview";
  hide?: {
    installments?: boolean;
    ratings?: boolean;
    productQuantityCartAndShipping?: boolean;
  };
  id?: string;
  partial?: boolean;
}) {
  const { description, offers, name = "", gtin, brand, productID, isVariantOf } = product;
  const { price = 0, availability, pureInstallments, listPrice, seller } = useOffer(offers);

  const productGroupID = isVariantOf?.productGroupID ?? "";
  const discount = price && listPrice ? listPrice - price : 0;

  const billingDuration = pureInstallments?.billingDuration ?? 0;
  const billingIncrement = pureInstallments?.billingIncrement ?? 0;

  const isAvailable = availability === "https://schema.org/InStock";

  const seals = [
    {
      label: product.isVariantOf?.additionalProperty.find((p) => p.name === "Selo 1 Esquerda")?.value,
      color: "#CD3D82",
    },
    {
      label: product.isVariantOf?.additionalProperty.find((p) => p.name === "Selo 2 Direita")?.value,
      color: "#830E4F",
    },
  ].filter((s) => s.label);

  const [perfectFor] = findAdditionalProperty(["Perfeito para"], product.isVariantOf);
  const [perfectForIcon] = findAdditionalProperty(["Perfeito para icon"], product.isVariantOf);
  const [actions] = findAdditionalProperty(["Ações"], product.isVariantOf);

  const [result] = findAdditionalProperty(["Resultado"], product.isVariantOf);
  const [useMode] = findAdditionalProperty(["Modo de uso"], product.isVariantOf);
  const [composition] = findAdditionalProperty(["O que ele tem?"], product.isVariantOf);
  const [compositionText] = findAdditionalProperty(["O que ele tem - completa"], product.isVariantOf);

  const uniquecharacteristics = new Set();
  const characteristics = findAdditionalProperty(["Por Necessidade", "Por Tipo de Cabelo", "Por Linha"])?.filter(
    (item) => {
      if (uniquecharacteristics.has(item.name)) {
        return false;
      }
      uniquecharacteristics.add(item.name);
      return true;
    }
  );

  return (
    <div class={"max-w-[518px] w-full overflow-hidden"}>
      {breadcrumbList && (
        <div class="hidden overflow-hidden lg:block">
          <Breadcrumb pageProduct={true} itemListElement={breadcrumbList?.itemListElement} />
        </div>
      )}

      <div class={"mb-[30px] mt-4 flex  gap-5 lg:gap-2"}>
        <h1>
          <span class="break-words text-xl lg:text-2xl font-bold text-neutral-0">{name}</span>
        </h1>

        <div>
          <WishlistButton product={product} />
        </div>
      </div>

      {isAvailable && (
        <div class="hidden lg:flex items-end gap-6 mb-[30px]">
          <div class="flex flex-col">
            {(listPrice ?? 0) > price && (
              <div class="flex items-center">
                <span class="text-sm font-light text-neutral-3 line-through font-tt-norms">
                  {formatPrice(listPrice, offers!.priceCurrency!)}
                </span>
                <span class="ml-4 w-[77px] h-[24px] bg-primary-400 flex items-center justify-center font-tt-norms text-xs font-bold text-white rounded-full">
                  -{calcOFF(listPrice ?? 0, price).toFixed(0)}% OFF
                </span>
              </div>
            )}
            <div class="flex flex-wrap items-end">
              <span class="text-2xl font-bold text-black font-tt-norms">
                {formatPrice(price, offers!.priceCurrency!)}
              </span>
              {!hide.installments && pureInstallments?.billingIncrement && (
                <span class="text-sm text-primary-500 font-tt-norms font-bold ml-1 whitespace-nowrap">
                  ou {billingDuration}x de {formatPrice(billingIncrement)} SEM JUROS
                </span>
              )}
            </div>
          </div>

          {!hide.productQuantityCartAndShipping && (
            <AddToCartButtonVTEX
              name={name}
              productID={productID}
              productGroupID={productGroupID}
              price={price}
              discount={discount}
              seller={seller ?? ""}
              quantity={1}
              class={
                "h-[52px] w-full lg:max-w-[204px] max-lg:hidden rounded border border-none bg-primary-500 hover:bg-primary-700 transition-colors font-medium text-white text-base"
              }
            />
          )}
        </div>
      )}

      {perfectFor?.value && perfectForIcon?.value && (
        <div class="flex gap-4 p-[15px] w-full bg-neutral-4 rounded-full mb-6">
          <img class="w-11 h-11 flex" src={perfectForIcon?.value} alt="Perfeito Para" />
          <h3 class="flex flex-col text-sm lg:text-base font-tt-norms font-normal text-neutral-1 !leading-tight">
            <span>perfeito para</span>
            <strong class="font-bold"> {perfectFor?.value}</strong>
          </h3>
        </div>
      )}

      {actions?.value && (
        <ul class="flex flex-col gap-[14px] mb-6">
          {actions?.value.split("\r\n").map((action: string) => (
            <li class="flex gap-[10px] items-center">
              <div class="w-5 h-5 rounded-full">
                <img src={asset("/image/marca-de-verificacao.png")} alt="verification-brand" />
              </div>
              <span class="text-base text-[#4A4A4A] font-tt-norms">{action}</span>
            </li>
          ))}
        </ul>
      )}

      {characteristics && characteristics.length > 0 && (
        <ul class="flex gap-2 mb-[30px] w-full">
          {characteristics?.map((characteristic) => (
            <li class="p-2 flex flex-col items-center justify-center text-neutral-1 w-full max-w-[168px] min-h-[70px] rounded-[10px] lg:rounded-full bg-neutral-4 border-primary-500 border">
              <span class="text-xs lowercase text-neutral-1 font-tt-norms">
                {characteristic.name!.replace("Por", "")}
              </span>
              <span class="text-lg text-neutral-1 font-bold font-tt-norms lowercase text-center leading-5">
                {characteristic?.value}
              </span>
            </li>
          ))}
        </ul>
      )}

      <ProductSpecifications
        composition={composition}
        result={result}
        useMode={useMode}
        compositionText={compositionText}
      />

      <div class="flex justify-center w-full gap-5">
        <Icon class={"w-full object-contain max-w-[141px]"} id="Vegano" width={141} height={55} />
        <Icon class={"w-full object-contain max-w-[171px]"} id="Animais" width={171} height={55} />
        <Icon class={"w-full object-contain max-w-[65px]"} id="Reciclo" width={65} height={55} />
      </div>

      <SendEventOnLoad
        event={{
          name: "view_item",
          params: {
            items: [
              mapProductToAnalyticsItem({
                product,
                breadcrumbList,
                price,
                listPrice,
              }),
            ],
          },
        }}
      />
    </div>
  );
}

export default ProductInfo;
