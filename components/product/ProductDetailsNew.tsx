import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import { useId } from "$store/sdk/useId.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import type { BreadcrumbList, Product } from "apps/commerce/types.ts";
import ProductInfoNew, { findAdditionalProperty } from "$store/components/product/ProductInfoNew.tsx";
import ProductImagesNew from "$store/components/product/ProductImagesNew.tsx";
import ProductBuyFixed from "$store/components/product/ProductBuyFixed.tsx";
import ProductStep from "$store/components/product/ProductStep.tsx";
import ProductBoost from "$store/components/product/ProductBoost.tsx";

export default function ProductDetailsNew({
  product,
  breadcrumbList,
  id: partialId,
}: {
  product: Product;
  breadcrumbList?: BreadcrumbList;
  id?: string;
}) {
  const id = useId();
  const pdpNew = true;
  const { image: images = [] } = product;

  const { price = 0, listPrice, availability } = useOffer(product.offers);

  const isAvailable = availability === "https://schema.org/InStock";

  const [stepDesktop] = findAdditionalProperty(["Banner passo a passo Desktop"], product.isVariantOf);
  const [stepMobile] = findAdditionalProperty(["Banner passo a passo Mobile"], product.isVariantOf);
  const [boost] = findAdditionalProperty(["Turbine seu tratamento"], product.isVariantOf);

  const videos = product
    ?.isVariantOf!.additionalProperty!.filter(({ name }) => name === "Video-Youtube-Dabelle")
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
    <>
      <div class="container max-w-[1296px] w-[95%] font-tt-norms mb-16 lg:mb-20">
        <div class="mt-4">
          {/* Breadcrumb */}
          {breadcrumbList && (
            <div class="lg:hidden mx-auto">
              <Breadcrumb itemListElement={breadcrumbList?.itemListElement.slice(0, -1)} />
            </div>
          )}

          <div class="flex flex-col items-center gap-x-7 lg:flex-row lg:items-start lg:justify-center">
            <ProductImagesNew images={images} videoWrongRegistredCount={videoWrongRegistredCount} videos={videos} />
            <ProductInfoNew product={product} breadcrumbList={breadcrumbList} id={partialId} partial />
          </div>
        </div>
        {isAvailable && <ProductBuyFixed product={product} />}
      </div>

      {((stepDesktop && stepMobile) || boost?.value) && (
        <div class="p-3 lg:p-5 border border-[#EE3B86] container max-w-[1340px] w-[98%] flex flex-col">
          <ProductBoost boost={JSON.parse(boost?.value ?? "")} />
          <ProductStep srcDesktop={stepDesktop?.value} srcMobile={stepMobile?.value} />
        </div>
      )}
    </>
  );
}
