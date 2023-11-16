import { asset } from "$fresh/runtime.ts";
import type { JSX } from "preact";

export type AvailableIcons =
  | "ArrowRight"
  | "ArrowsPointingOut"
  | "BNDES"
  | "BackToHomeArrow"
  | "Bars3"
  | "BigShoppingCart"
  | "BoletoIcon"
  | "BuyTogetherEq"
  | "BuyTogetherPlus"
  | "ChevronDown"
  | "ChevronLeft"
  | "ChevronRight"
  | "ChevronUp"
  | "CircleX"
  | "Close"
  | "CreditCard"
  | "CreditCards"
  | "Deco"
  | "Decrease"
  | "Diners"
  | "Discord"
  | "Discount"
  | "Elo"
  | "Elos"
  | "Eye"
  | "Facebook"
  | "FilterList"
  | "GiftBox"
  | "GiftVoucher"
  | "Heart"
  | "Increase"
  | "InputError"
  | "InputSuccess"
  | "Instagram"
  | "Linkedin"
  | "MagnifyingGlass"
  | "MapPin"
  | "Mastercard"
  | "Mastercards"
  | "Message"
  | "Microphone"
  | "MinicartBag"
  | "Minus"
  | "Padlock"
  | "ParcelamentoArrow"
  | "Paypal"
  | "Phone"
  | "Pin"
  | "Pinterest"
  | "Pix"
  | "Pixs"
  | "Plus"
  | "QuemSomosPlay"
  | "Return"
  | "Ruler"
  | "SetaCima"
  | "ShippingCart"
  | "ShoppingCart"
  | "Star"
  | "ThumbsUp"
  | "Tiktok"
  | "Trash"
  | "Trophy"
  | "Truck"
  | "Twitter"
  | "User"
  | "VideoPlay"
  | "Visa"
  | "Visas"
  | "WhatsApp"
  | "XMark"
  | "Youtube"
  | "Zoom"
  | "idkCep"
  | "Reciclo"
  | "Vegano"
  | "Animais";

interface Props extends JSX.SVGAttributes<SVGSVGElement> {
  /**
   * Symbol id from element to render. Take a look at `/static/icons.svg`.
   *
   * Example: <Icon id="Bell" />
   */
  id: AvailableIcons;
  size?: number;
}

function Icon({ id, strokeWidth = 16, size, width, height, ...otherProps }: Props) {
  return (
    <svg {...otherProps} width={width ?? size} height={height ?? size} strokeWidth={strokeWidth}>
      <use href={asset(`/sprites.svg#${id}`)} />
    </svg>
  );
}

export default Icon;
