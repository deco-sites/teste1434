import { PropertyValue } from "apps/commerce/types.ts";
import { useId } from "preact/hooks";
import ProductSpecificationsJs from "../../islands/ProductSpecificationsJs.tsx";

interface Props {
  useMode: PropertyValue;
  result: PropertyValue;
  composition: PropertyValue;
  compositionText: PropertyValue;
}

export default function ProductSpecifications({ composition, useMode, result, compositionText }: Props) {
  const tabs = [composition, useMode, result].filter((item) => !!item?.value);
  const tabId = `product-specifications-${useId()}`;
  const triggerId = `product-specifications-trigger-${useId()}`;
  const contentId = `product-specifications-content-${useId()}`;

  if (tabs.length === 0) return null;

  return (
    <>
      <div id={tabId} class={"flex flex-col w-full border border-primary-500 mb-[30px]"}>
        <ul class={"flex flex-shrink w-full border-b border-primary-500"} id={triggerId}>
          {tabs.map((tab, index: number) => (
            <li
              class={
                "w-full h-10 flex justify-center items-center text-base font-bold transition-colors font-tt-norms text-neutral-3 cursor-pointer  bg-white underline data-[tab-active=true]:bg-primary-500 data-[tab-active=true]:text-white "
              }
              data-tab-index={index}
              data-tab-active={index === 0}
            >
              {tab?.name}
            </li>
          ))}
        </ul>
        <div class={"px-3 py-[30px]"} dangerouslySetInnerHTML={{ __html: tabs[0].value ?? "" }} id={contentId}></div>
      </div>

      <ProductSpecificationsJs id={tabId} contentId={contentId} tabs={tabs} compositionText={compositionText?.value} />
    </>
  );
}
