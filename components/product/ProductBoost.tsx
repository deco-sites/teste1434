interface Product {
  image: string;
  title: string;
  subTitle: string;
  description: string;
}

interface Props {
  boost?: {
    products: Product[];
    link: string;
  };
}

export default function ProductBoost({ boost }: Props) {
  if (!boost?.products) return null;

  return (
    <div class={"flex flex-col items-center mb-14"}>
      <h2 class={"text-3xl lg:text-4xl font-bold text-[#303030] font-tt-norms text-center w-full mb-1 lg:mb-0"}>
        Turbine seu tratamento
      </h2>
      <a class={"text-base underline text-[#828282]"} href={boost.link}>
        sugestão de uso
      </a>
      <div class={"mt-10 flex flex-row gap-8 lg:gap-10"}>
        {boost.products.map((product) => (
          <div class={"flex flex-col lg:flex-row items-center max-w-[159px] lg:max-w-[630px] w-full gap-4"}>
            <img
              class={"max-w-[307px] w-full flex h-auto object-cover max-lg:order-2"}
              src={product?.image}
              alt={product?.title}
              height={"auto"}
              width={"100%"}
            />
            <div class="w-full max-w-[307px] contents lg:flex flex-col items-start">
              <h3
                class={
                  "text-base lg:text-lg text-[#EB3F86] font-bold font-tt-norms mb-[30px] max-lg:order-1 text-center w-full"
                }
              >
                {product?.title}
              </h3>
              <span class="text-base font-bold text-[#4A4A4A] mb-[10px] font-tt-norms order-3">
                {product?.subTitle}
              </span>
              <p class="text-base marker:text-[#4A4A4A] font-tt-norms order-3">{product?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
