import { IS_BROWSER } from "$fresh/runtime.ts";
import { PropertyValue } from "apps/commerce/types.ts";

interface Props {
  id: string;
  contentId: string;
  tabs: PropertyValue[];
  compositionText?: string;
}

export default function ProductSpecificationsJs({ id, contentId, tabs }: Props) {
  if (IS_BROWSER) {
    const $parent = document.querySelector(`#${id}`);
    const $content = $parent?.querySelector(`#${contentId}`);

    const triggers = $parent?.querySelectorAll("[data-tab-index]");
    const compositionText = "compositionText";
    let buttonText = "";

    triggers?.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const index = Number(trigger.getAttribute("data-tab-index"));

        const $active = $parent?.querySelector("[data-tab-active=true]");
        $active?.removeAttribute("data-tab-active");

        trigger?.setAttribute("data-tab-active", "true");

        if ($content) {
          $content.innerHTML = tabs[index].value ?? "";

          const $compositionText = $content.querySelector(".composition-text");

          if ($compositionText && compositionText) {
            $compositionText.innerHTML = compositionText;

            const $buttonOpen = $parent?.querySelector(".composition button");

            if (buttonText === "") buttonText = $buttonOpen?.textContent ?? "";

            $buttonOpen?.addEventListener("click", () => {
              if ($compositionText.getAttribute("data-show") === "true") {
                $compositionText.setAttribute("data-show", "false");
                $buttonOpen.innerHTML = buttonText;
                $buttonOpen.setAttribute("data-show", "false");
              } else {
                $compositionText.setAttribute("data-show", "true");
                $buttonOpen.setAttribute("data-show", "true");
                $buttonOpen.innerHTML = "ver menos >";
              }
            });
          }
        }
      });
    });
  }
  return null;
}
