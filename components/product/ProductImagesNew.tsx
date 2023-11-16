import { ImageObject } from "apps/commerce/types.ts";
import Slider from "$store/components/ui/Slider.tsx";
import Image from "apps/website/components/Image.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { Video } from "deco-sites/dabelleultimate/components/product/ProductInfoNew.tsx";
import { useId } from "preact/hooks";
import { SliderGroup } from "deco-sites/dabelleultimate/components/ui/SliderGroup.tsx";
import SliderJS from "$store/islands/SliderJsNew.tsx";
import RenderHTML from "$store/components/ui/RenderHTML.tsx";

interface Props {
  videos: Video[];
  videoWrongRegistredCount: number;
  images: ImageObject[];
}

const WIDTH = 360;
const HEIGHT = 360;
const ASPECT_RATIO = `${WIDTH} / ${HEIGHT}`;

export default function ProductImagesNew({ videos, images, videoWrongRegistredCount }: Props) {
  const groupId = `group-${useId()}`;
  const sliderId = `slider-${useId()}`;
  const thumbsId = `thumbs-${useId()}`;
  const slides = [...(videos.length ? videos : Array(videoWrongRegistredCount).fill(null)), ...images];

  return (
    <>
      <SliderGroup class={"max-w-[748px] w-full lg:min-w-[600px]"} id={groupId}>
        <div class="flex flex-row gap-x-4 lg:gap-x-5 mt-4 lg:mt-0 bg-[#F8F7F3] px-2 py-4 max-w-[748px] w-full">
          {/* Thumbs */}
          <div
            id={thumbsId}
            data-group-slider
            class="flex flex-col items-center max-h-[650px] max-w-[80px] md:max-w-[min(100vw,650px)]"
          >
            <Slider
              class="carousel snap-y snap-mandatory snap-start relative max-h-[256px] md:max-h-[532px] gap-2 lg:gap-4 px-0 w-full
			flex-col lg:justify-start lg:px-0 mb-auto
		"
            >
              {slides.map((item, index) =>
                item === null || ((item as Video).thumbnail && (item as Video).value.includes("iframe")) ? (
                  <Slider.Item
                    index={index}
                    class="carousel-item min-w-[80px] md:min-w-[164px] min-h-[80px] md:min-h-[164px] relative cursor-pointer"
                  >
                    <div class="">
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
                        class="transition-opacity"
                        width={164}
                        height={164}
                        src={
                          item === null
                            ? "https://files.catbox.moe/3vtswx.webp"
                            : `https://i.ytimg.com/vi/${(item as Video).thumbnail}/sddefault.jpg`
                        }
                        alt={item === null ? "" : (item as ImageObject).alternateName}
                      />
                    </div>
                  </Slider.Item>
                ) : (
                  <Slider.Item
                    index={index}
                    class="carousel-item min-w-[80px] md:min-w-[164px] min-h-[80px] md:min-h-[164px] cursor-pointer"
                  >
                    <Image
                      style={{ aspectRatio: ASPECT_RATIO }}
                      class="transition-opacity"
                      width={164}
                      height={164}
                      src={(item as ImageObject).url!}
                      alt={(item as ImageObject).alternateName}
                    />
                  </Slider.Item>
                )
              )}
            </Slider>

            <div class={"flex justify-center left-0 w-full gap-4 mt-5"}>
              <Slider.NextButton class="group grid w-6 h-6 md:h-14 md:w-14 rounded-full bg-[#C0BFBE] cursor-pointer place-items-center transition-colors duration-300 hover:bg-neutral-2">
                <Icon
                  size={25}
                  id="ChevronRight"
                  strokeWidth={3}
                  class="transition-colors group-hover:text-white max-md:w-4 max-md:h-4 text-white rotate-90"
                />
              </Slider.NextButton>

              <Slider.PrevButton class="group grid w-6 h-6 md:h-14 md:w-14 rounded-full bg-[#C0BFBE] rotate-180 cursor-pointer place-items-center transition-colors duration-300 hover:bg-neutral-2">
                <Icon
                  size={25}
                  id="ChevronRight"
                  strokeWidth={3}
                  class="transition-colors group-hover:text-white max-md:w-4 max-md:h-4 text-white rotate-90"
                />
              </Slider.PrevButton>
            </div>

            <SliderJS rootId={thumbsId} axis="y" />
          </div>

          {/* Image Slider */}
          <div class="relative max-h-[650px] max-w-[550px] px-3 py-10 lg:px-[25px] lg:py-[75px] w-full overflow-hidden mx-auto bg-neutral-4">
            <div id={sliderId} data-group-controller class="h-full w-full">
              <Slider class="carousel-center carousel md:max-h-[500px] items-center w-full gap-6 px-0">
                {slides.map((image, index) => (
                  <Slider.Item class={"carousel-item w-full h-full relative"} index={index}>
                    {image && (image as Video).value ? (
                      <RenderHTML html={(image as Video).value} class="w-full h-full object-contain" />
                    ) : (
                      <>
                        <Image
                          style={{ aspectRatio: "500/500" }}
                          src={image ? (image as ImageObject).url! : "https://files.catbox.moe/33nrqz.webp"}
                          alt={image ? (image as ImageObject).alternateName : ""}
                          width={500}
                          height={500}
                          class={"w-full h-full object-contain"}
                          // Preload LCP image for better web vitals
                          preload={index === 0}
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                      </>
                    )}
                  </Slider.Item>
                ))}
              </Slider>

              {slides.length > 1 && (
                <div class={"absolute left-0 bottom-6 flex justify-center w-full gap-[10px]"}>
                  {slides.map((_, index) => (
                    <Slider.Dot index={index}>
                      <div
                        class={
                          "w-4 h-4 rounded-full border-[2px] border-white bg-white group-disabled:bg-transparent transition-colors"
                        }
                      ></div>
                    </Slider.Dot>
                  ))}
                </div>
              )}

              <Slider.PrevButton class="group absolute left-4 top-[42.5%] grid w-6 h-6 md:h-14 md:w-14 rounded-full cursor-pointer place-items-center transition-colors duration-300 bg-primary-500 hover:bg-primary-700">
                <Icon
                  size={25}
                  id="ChevronRight"
                  strokeWidth={3}
                  class="transition-colors text-white group-hover:text-white -rotate-180 max-md:w-4 max-md:h-4"
                />
              </Slider.PrevButton>

              <Slider.NextButton
                class="group absolute right-4 top-[42.5%] grid w-6 h-6 md:h-14 md:w-14 rounded-full cursor-pointer place-items-center transition-colors duration-300 bg-primary-500 hover:bg-primary-700"
                disabled={images.length < 2}
              >
                <Icon
                  size={25}
                  id="ChevronRight"
                  strokeWidth={3}
                  class="transition-colors text-white group-hover:text-white max-md:w-4 max-md:h-4"
                />
              </Slider.NextButton>

              <SliderJS infinite rootId={sliderId} controller groupId={groupId} />
            </div>
          </div>
        </div>
      </SliderGroup>
    </>
  );
}
