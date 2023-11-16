import Icon from '$store/components/ui/Icon.tsx'
import { AvailableIcons } from '$store/components/ui/Icon.tsx'

export interface Shortcut {
	label?: string
	icon?: AvailableIcons
	link?: string
}

export interface Props {
	shortcuts?: Array<Shortcut>
	onHover?: 'Show label' | 'Show tooltip'
}

export default function Shortcuts({ shortcuts, onHover }: Props) {
	return (
		<div class='group fixed flex flex-col bottom-[14px] right-[21px] z-20 gap-2.5'>
			<div class='flex items-center justify-center ml-1 bg-white rounded-[5px] w-[41px] max-w-[41px] h-[41px] max-h-[41px] shadow-[2px_2px_5px_0px_rgba(0,0,0,0.15)]'>
				<a href='#top'>
					<Icon id='SetaCima' size={24} class='ml-[13px] text-[#252525]' />
					<span class='sr-only'>Voltar para o topo</span>
				</a>
			</div>
			{shortcuts?.map((shortcut) => {
				return (
					<a
						href={shortcut.link}
						target='_blank'
						class={`flex items-center justify-center h-[51px] rounded-full w-[51px] bg-[#25D366] text-base-content mt-[-2px] ${
							onHover === 'Show tooltip' ? 'tooltip tooltip-left' : ''
						}`}
						data-tip={shortcut.label}
					>
						<span class='sr-only'>{shortcut.label}</span>
						<div class='flex justify-center text-white'>
							{shortcut.icon && <Icon id={shortcut.icon} size={30} />}
						</div>
					</a>
				)
			})}
		</div>
	)
}
