import { SendEventOnLoad } from "$store/components/Analytics.tsx";
import Installments from "$store/components/product/Installments.tsx";
import ProductQuantityCartAndShipping from "$store/components/product/ProductQuantityCartAndShipping.tsx";
import ProductSelector from "$store/components/product/ProductVariantSelector.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import Button from "$store/components/ui/Button.tsx";
import Collapsable from "$store/components/ui/Collapsable.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import RenderHTML from "$store/components/ui/RenderHTML.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import SliderJS from "$store/components/ui/SliderJS.tsx";
import WishlistButton from "$store/components/wishlist/WishlistButton.tsx";
import ProductImageZoom from "$store/islands/ProductImageZoom.tsx";
import calcOFF from "$store/sdk/calcOFF.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { pick } from "$store/sdk/pick.ts";
import { useId } from "$store/sdk/useId.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { BreadcrumbList, ImageObject, Product, ProductDetailsPage } from "apps/commerce/types.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import Image from "apps/website/components/Image.tsx";
import DetailsNew from "$store/components/product/ProductDetailsNew.tsx";

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
function NotFound() {
  return (
    <div class="flex w-full items-center justify-center py-28">
      <div class="flex flex-col items-center justify-center gap-6">
        <span class="text-2xl font-medium">Página não encontrada</span>
        <a href="/">
          <Button>Voltar à página inicial</Button>
        </a>
      </div>
    </div>
  );
}

export function ProductInfo({
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
  const { description, offers, name = "", gtin, brand } = product;
  const { price = 0, listPrice, availability } = useOffer(offers);

  const isAvailable = availability === "https://schema.org/InStock";

  const useMode = product.isVariantOf?.additionalProperty.find((i) => i.name === "Modo de uso")?.value;

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

  const specifications =
    product.isVariantOf?.additionalProperty &&
    Object.entries(
      product.isVariantOf?.additionalProperty
        ?.filter(
          (i) =>
            i.name &&
            !["Modo de uso", "sellerId", "Video-Youtube-Dabelle", "Selo 1 Esquerda", "Selo 2 Direita"].includes(i.name)
        )
        .reduce((acc, cur) => {
          const { name, value } = cur as {
            name: string;
            value: string;
          };

          if (acc[name]) {
            acc[name] = acc[name] + ", " + value;
          } else {
            acc[name] = value;
          }

          return acc;
        }, {} as Record<string, string>)
    );

  return (
    <>
      {/* Breadcrumb */}
      {breadcrumbList && (
        <div class="hidden lg:block">
          <Breadcrumb itemListElement={breadcrumbList?.itemListElement.slice(0, -1)} />
        </div>
      )}
      {/* Code and name */}
      <div class={seals.length ? "mb-2" : "mb-4"}>
        <div class="mt-3 flex items-center">
          {gtin && brand ? (
            <span class="text-sm text-neutral-1">
              Código: {gtin} {brand?.name && <>| Marca: {brand?.name}</>}
            </span>
          ) : gtin ? (
            <span class="text-sm text-neutral-1">Código: {gtin}</span>
          ) : brand ? (
            <span class="text-sm text-neutral-1">Marca: {brand?.name}</span>
          ) : null}
          {!hide.ratings && (
            <div class="ml-auto">
              <div id="stars-rating" />
            </div>
          )}
          <div class="ml-auto">
            <WishlistButton product={product} variant="product" />
          </div>
        </div>
        <h1>
          <span class="break-words text-2xl font-bold text-neutral-0">{name}</span>
        </h1>
      </div>
      {/* Seals */}
      {seals.length ? (
        <div class="mb-9 flex w-full items-center gap-x-2">
          {seals.map((seal) => (
            <div
              class="grid min-h-[32px] w-full place-items-center text-center text-sm font-tt-norms font-bold text-white"
              style={{ background: seal.color }}
            >
              {seal.label}
            </div>
          ))}
        </div>
      ) : null}
      {/* Prices */}
      {isAvailable && (
        <div class="border-t border-[#C8C8C8] pt-8">
          <div class="flex flex-col">
            {(listPrice ?? 0) > price && (
              <span class="text-sm font-light text-neutral-1 line-through font-tt-norms">
                De: {formatPrice(listPrice, offers!.priceCurrency!)}
              </span>
            )}
            <div>
              <span class="text-lg font-bold text-neutral-0 font-tt-norms">
                {(listPrice ?? 0) > price && "Por: "}
                {formatPrice(price, offers!.priceCurrency!)}
              </span>

              {!hide.installments && <Installments product={product} />}
            </div>
          </div>
        </div>
      )}
      {/* Sku Selector */}
      {isAvailable && (
        <div class="mt-4 sm:mt-6">
          <ProductSelector product={product} id={id} partial={partial} />
        </div>
      )}
      {/* Add to Cart, quantity, shipping */}
      {!hide.productQuantityCartAndShipping && (
        <ProductQuantityCartAndShipping {...pick(product, "productID", "sku", "isVariantOf", "offers")} />
      )}
      {/* Description card */}
      <div class="py-4 sm:py-6 font-tt-norms border-b border-[#C8C8C8]">
        {description && (
          <Collapsable
            title={
              <div class="flex items-center justify-between text-base text-neutral-0">
                <strong>Descrição do Produto</strong>

                <Icon id="Plus" size={24} class="group-open:hidden" />
                <Icon id="Minus" size={24} class="hidden group-open:block" />
              </div>
            }
          >
            {<RenderHTML html={description} class="prose font-tt-norms text-neutral-1 leading-tight text-sm mt-3" />}
          </Collapsable>
        )}
      </div>
      {/* Especificações */}
      <div class="mt-4 sm:mt-6 font-tt-norms">
        {specifications && specifications.length ? (
          <Collapsable
            title={
              <div class="flex items-center justify-between text-base text-neutral-0">
                <strong>Especificações</strong>

                <Icon id="Plus" size={24} class="group-open:hidden" />
                <Icon id="Minus" size={24} class="hidden group-open:block" />
              </div>
            }
          >
            <ul class="flex flex-col gap-y-1">
              {specifications.map(([name, value]) => (
                <li class="flex justify-between items-center text-neutral-0 text-sm font-tt-norms first:mt-3">
                  <span class="font-bold">{name}</span>
                  <span>{value}</span>
                </li>
              ))}
            </ul>
          </Collapsable>
        ) : null}
      </div>
      {useMode && (
        <div class="mt-4 sm:mt-6 font-tt-norms border-t border-[#C8C8C8] pt-4">
          <Collapsable
            title={
              <div class="flex items-center justify-between text-base text-neutral-0">
                <strong>Modo de uso</strong>

                <Icon id="Plus" size={24} class="group-open:hidden" />
                <Icon id="Minus" size={24} class="hidden group-open:block" />
              </div>
            }
          >
            <RenderHTML html={useMode} class="mt-3" />
          </Collapsable>
        </div>
      )}
      {/* Analytics Event */}
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
    </>
  );
}

export function Details({
  product,
  breadcrumbList,
  id: partialId,
}: {
  product: Product;
  breadcrumbList?: BreadcrumbList;
  id?: string;
}) {
  const id = useId();
  const { image: images = [] } = product;

  const { price = 0, listPrice } = useOffer(product.offers);
  const videos = product
    .isVariantOf!.additionalProperty!.filter(({ name }) => name === "Video-Youtube-Dabelle")
    .map(({ value }) => {
      if (!value!.match(/(?<=src=)".+?"/g)!) return null;

      return {
        value: value!.replace(/width="\d+" height="\d+"/g, 'width="100%" height="300px"'),
        thumbnail: [
          ...value!.matchAll(
            /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be.com\/\S*(?:watch|embed)(?:(?:(?=\/[-a-zA-Z0-9_]{11,})\/)|(?:\S*v=|v\/)))([-a-zA-Z0-9_]{11,})/g
          ),
        ][0]?.[1],
      };
    })
    .filter(Boolean) as {
    value: string;
    thumbnail: string;
  }[];

  const videosCount = product.isVariantOf!.additionalProperty!.filter(
    ({ name }) => name === "Video-Youtube-Dabelle"
  ).length;
  const videoWrongRegistredCount = videosCount - videos.length;

  return (
    <div class="mt-4">
      {/* Breadcrumb */}
      {breadcrumbList && (
        <div class="lg:hidden mx-auto">
          <Breadcrumb itemListElement={breadcrumbList?.itemListElement.slice(0, -1)} />
        </div>
      )}
      <div id={id} class="flex flex-col items-center gap-x-7 lg:flex-row lg:items-start lg:justify-center">
        <div class="flex flex-col-reverse lg:flex-row gap-x-10 lg:gap-x-5 mt-4 lg:mt-0">
          <div class="flex lg:flex-col items-center max-h-[536px] max-w-[min(100vw,536px)]">
            {/* Dots */}
            <Slider.PrevButtonDot class="group m-auto lg:mt-0 mr-4 lg:mr-auto mb-4 grid h-11 w-11 rotate-180 cursor-pointer place-items-center bg-transparent transition-colors duration-300 hover:bg-primary-500">
              <Icon
                size={18}
                id="ChevronRight"
                strokeWidth={3}
                class="transition-colors group-hover:text-white rotate-180 lg:rotate-90"
              />
            </Slider.PrevButtonDot>

            <ul
              class="
                            carousel relative max-h-[385px] gap-2 px-4 w-full
                            lg:flex-col lg:justify-start lg:px-0
                        "
            >
              {[...(videos.length ? videos : Array(videoWrongRegistredCount).fill(null)), ...images].map((i, index) =>
                i === null || ((i as Video).thumbnail && (i as Video).value.includes("iframe")) ? (
                  <li class="carousel-item min-w-[90px] min-h-[90px] relative">
                    <Slider.Dot index={index}>
                      <div class="group-[&:not(:disabled)]:opacity-50">
                        <Icon
                          id="VideoPlay"
                          width={42}
                          height={42}
                          class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        <Image
                          style={{
                            aspectRatio: ASPECT_RATIO,
                          }}
                          class="transition-opacity group-disabled:border group-disabled:border-neutral-2"
                          width={90}
                          height={90}
                          src={
                            i === null
                              ? "https://files.catbox.moe/3vtswx.webp"
                              : `https://i.ytimg.com/vi/${(i as Video).thumbnail}/sddefault.jpg`
                          }
                          alt={i === null ? "" : (i as ImageObject).alternateName}
                        />
                      </div>
                    </Slider.Dot>
                  </li>
                ) : (
                  <li class="carousel-item min-w-[90px] min-h-[90px]">
                    <Slider.Dot index={index}>
                      <Image
                        style={{ aspectRatio: ASPECT_RATIO }}
                        class="group-[&:not(:disabled)]:opacity-50 transition-opacity group-disabled:border group-disabled:border-neutral-2"
                        width={90}
                        height={90}
                        src={(i as ImageObject).url!}
                        alt={(i as ImageObject).alternateName}
                      />
                    </Slider.Dot>
                  </li>
                )
              )}
            </ul>

            <Slider.NextButtonDot class="group m-auto ml-4 lg:ml-auto lg:mt-4 grid h-11 w-11 cursor-pointer place-items-center bg-transparent transition-colors duration-300 hover:bg-primary-500">
              <Icon
                size={18}
                id="ChevronRight"
                strokeWidth={3}
                class="transition-colors group-hover:text-white lg:rotate-90"
              />
            </Slider.NextButtonDot>
          </div>

          {/* Image Slider */}
          <div class="relative max-h-[550px] max-w-[500px] overflow-x-hidden mx-auto">
            {listPrice && listPrice > price && (
              <span class="absolute left-4 top-4 w-16 rounded bg-primary-400 py-1 text-center text-sm font-bold text-white z-10">
                -{calcOFF(listPrice, price).toFixed(0)}%
              </span>
            )}

            <Slider class="carousel-center carousel max-h-[500px] w-screen gap-6">
              {[...(videos.length ? videos : Array(videoWrongRegistredCount).fill(null)), ...images].map(
                (img, index) => (
                  <ProductImageZoom image={img} index={index} />
                )
              )}
            </Slider>

            <Slider.PrevButton class="group absolute left-2 top-[42.5%] grid h-11 w-11 cursor-pointer place-items-center bg-transparent transition-colors duration-300 hover:bg-primary-500">
              <Icon
                size={24}
                id="ChevronRight"
                strokeWidth={3}
                class="transition-colors group-hover:text-white -rotate-180"
              />
            </Slider.PrevButton>

            <Slider.NextButton
              class="group absolute right-2 top-[42.5%] grid h-11 w-11 cursor-pointer place-items-center bg-transparent transition-colors duration-300 hover:bg-primary-500"
              disabled={images.length < 2}
            >
              <Icon size={24} id="ChevronRight" strokeWidth={3} class="transition-colors group-hover:text-white" />
            </Slider.NextButton>

            <span class="hidden items-center justify-center gap-x-1 text-xs font-light text-neutral-0 lg:flex mt-3">
              <Icon id="Zoom" size={18} />
              Posicione o mouse sob a imagem para dar zoom
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div class="scroll mt-10 w-full max-w-[536px] px-2 lg:mt-0 lg:max-h-[536px] lg:overflow-y-scroll">
          <ProductInfo product={product} breadcrumbList={breadcrumbList} id={partialId} partial />
        </div>
      </div>
      <SliderJS rootId={id} startFrom={videos.length || videoWrongRegistredCount ? 1 : 0} orientation="vertical" />
    </div>
  );
}

function ProductDetails({ page, id }: Props) {

  return (
    <>
      {page ? (
        <DetailsNew {...pick(page, "product", "breadcrumbList")} />
      ) : (
        <div class="container max-w-[1220px] w-[95%] font-tt-norms">
          <NotFound />
        </div>
      )}
    </>
  );

  //return (
  //  <div class="container max-w-[1220px] w-[95%] font-tt-norms">
  //    {page ? <Details {...pick(page, "product", "breadcrumbList")} id={id} /> : <NotFound />}
  //  </div>
  //);
}

export default ProductDetails;
