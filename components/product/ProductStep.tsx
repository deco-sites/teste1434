import { Picture, Source } from "apps/website/components/Picture.tsx";

export interface Props {
  srcDesktop?: string;
  srcMobile?: string;
}

export default function ProductStep({ srcDesktop, srcMobile }: Props) {
  if (!srcDesktop && !srcMobile) return null;

  return (
    <div
      data-mobile={!!srcMobile}
      data-desktop={!!srcDesktop}
      class={"flex flex-col items-center lg:data-[desktop=false]:hidden max-lg:data-[mobile=false]:hidden"}
    >
      <h2 class={"text-3xl lg:text-4xl font-bold text-[#303030] font-tt-norms mb-5"}>Passo a passo</h2>
      <Picture>
        <Source media="(max-width: 1024px)" src={srcMobile ?? ""} width={384} height={557} />
        <Source media="(min-width: 1025px)" src={srcDesktop ?? ""} width={1076} height={326} />
        <img class="w-full rounded-[30px]" src={srcDesktop} alt={"Passo a passo"} decoding="async" loading="lazy" />
      </Picture>
    </div>
  );
}
