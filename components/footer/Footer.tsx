import Copyright, { CopyrightProps } from '$store/components/footer/Copyright.tsx'
import Icon, { AvailableIcons } from '$store/components/ui/Icon.tsx'
import RenderHTML from '$store/components/ui/RenderHTML.tsx'
import Image from 'apps/website/components/Image.tsx'
import type { HTMLWidget, ImageWidget } from 'apps/admin/widgets.ts'

/**
 * @titleBy icon
 */
interface SocialMedia {
	icon: AvailableIcons
	href: string
}

/**
 * @titleBy text
 */
interface LinksForYou {
	text: string
	href: string
}

/**
 * @titleBy text
 */
interface LinksInstitutional {
	text: string
	href: string
}

/**
 * @titleBy text
 */
interface LinksInformation {
	text: string
	href: string
}

/**
 * @titleBy alt
 */
interface PaymentIcons {
	image: ImageWidget
	href: string
	alt?: string
}

/**
 * @titleBy alt
 */
interface SecurityImages {
	image: ImageWidget
	href: string
	alt?: string
}

/**
 * @titleBy alt
 */
interface CompaniesHaveDeveloped {
	image: ImageWidget
	imageMobile: ImageWidget
	href: string
	alt?: string
}

/**
 * @titleBy title
 */
interface openingHours {
	/**
	 * @title Título
	 */
	title: string
}

interface InfosCompany {
	/**
	 * @title Logotipo da marca
	 */
	logo: ImageWidget
	/**
	 * @title Texto alternativo
	 */
	alt?: string
	/**
	 * @title Horário de funcionamento
	 */
	openingHours: openingHours[]
	/**
	 * @title Primeiro telefone
	 */
	firstPhone: string
	/**
	 * @title Segundo telefone
	 */
	secondPhone: string
	email: string
	/**
	 * @title Redes sociais
	 */
	socialMedia: SocialMedia[]
	/**
	 * @title Titulo do sobre
	 */
	titleAbout: string
	/**
	 * @title Texto do sobre
	 */
	about: HTMLWidget
	/**
	 * @title Texto do sobre Mobile
	 */
	aboutMobile: HTMLWidget
	/**
	 * @title Texto do sobre Botão do Footer Mobile
	 */
	buttonAbout: string
	linkAbout: string
	/**
	 * @title Links do Para Você
	 */
	linksForYou: LinksForYou[]
	/**
	 * @title Links do Institucional
	 */
	linksInstitutional: LinksInstitutional[]
	/**
	 * @title Links do Informações
	 */
	linksInformation: LinksInformation[]
	/**
	 * @title Ícones de pagamento
	 */
	paymentIcons: PaymentIcons[]
	/**
	 * @title Imagem de segurança
	 */
	securityImages: SecurityImages[]
	logoVtex: CompaniesHaveDeveloped
	logoDeco: CompaniesHaveDeveloped
	logoAgenciaPlus: CompaniesHaveDeveloped
}

export interface Props {
	copyrightInfos: CopyrightProps
	infosCompany: InfosCompany
	/**
	 * @ignore
	 */
	isMobile: boolean
}

export default function NewFooter({ copyrightInfos, infosCompany, isMobile }: Props) {
	return (
		<>
			{isMobile
				? (
					<>
						{/* Footer Mobile */}
						<div class='flex flex-col font-tt-norms'>
							<div class='bg-primary-500'>
								<div class='container flex lg:flex-row flex-col items-center'>
									<div class='flex flex-col items-center w-full'>
										<div class='flex flex-col items-center mb-[31px] mt-[7px] px-[43px] lg:mt-0'>
											<Image
												src={infosCompany.logo}
												alt={infosCompany.alt}
												width={119}
												height={59}
											/>
											<div class='w-full h-max mt-[25px]'>
												<h3 class='text-lg font-bold text-white mb-[38px] text-center'>
													{infosCompany.titleAbout}
												</h3>
												<RenderHTML
													html={infosCompany.aboutMobile}
													class='text-white text-sm text-center'
												/>
												<div class='w-full mt-[11px]'>
													<a
														href={infosCompany.linkAbout}
														class='w-full bg-white'
													>
														<p class='w-full rounded-[5px] text-center py-[11px] bg-white text-primary-500 font-bold'>
															{infosCompany.buttonAbout}
														</p>
													</a>
												</div>
											</div>
										</div>
										<div class='w-full h-[2px] bg-white' />
										<ul>
											<li
												class={`collapse collapse-arrow text-gray-100 bg-primary-500 border-b-2 border-white rounded-none h-auto`}
											>
												<input type='checkbox' class='h-14 min-h-[auto]' />
												<p
													class='collapse-title h-14 min-h-[auto]'
													aria-label='Item'
												>
													<span class='text-white font-bold'>
														Horário de Atendimento
													</span>
												</p>
												<ul class='collapse-content bg-white !p-0'>
													<li class='py-[37px] px-[21px]'>
														<div>
															{infosCompany?.openingHours?.map((
																item,
																index,
															) => (
																<p
																	key={index}
																	class='text-xs text-neutral-0 font-bold'
																>
																	{item?.title}
																</p>
															))}
														</div>
														<div class='mt-4'>
															<p class='text-xs text-neutral-0 font-bold'>
																Dúvidas? Entre em contato:
															</p>
															<p class='text-xs text-neutral-0 font-bold'>
																{infosCompany.firstPhone} |{' '}
																{infosCompany.secondPhone}
															</p>
															<p class='text-xs text-neutral-0 font-bold'>
																{infosCompany.email}
															</p>
														</div>
													</li>
												</ul>
											</li>
											<li
												class={`collapse collapse-arrow text-gray-100 bg-primary-500 border-b-2 border-white rounded-none h-auto`}
											>
												<input type='checkbox' class='h-14 min-h-[auto]' />
												<p
													class='collapse-title h-14 min-h-[auto]'
													aria-label='Item'
												>
													<span class='text-white font-bold'>
														Para você
													</span>
												</p>
												<ul class='collapse-content bg-white !p-0'>
													<li class='py-[37px] px-[21px]'>
														<div class='flex flex-col gap-[10px]'>
															{infosCompany.linksForYou.map((
																links,
																index,
															) => (
																<a
																	href={links.href}
																	key={index}
																	class='text-neutral-0 text-xs'
																>
																	{links.text}
																</a>
															))}
														</div>
													</li>
												</ul>
											</li>
											<li
												class={`collapse collapse-arrow text-gray-100 bg-primary-500 border-b-2 border-white rounded-none h-auto`}
											>
												<input type='checkbox' class='h-14 min-h-[auto]' />
												<p
													class='collapse-title h-14 min-h-[auto]'
													aria-label='Item'
												>
													<span class='text-white font-bold'>
														Institucional
													</span>
												</p>
												<ul class='collapse-content bg-white !p-0'>
													<li class='py-[37px] px-[21px]'>
														<div class='flex flex-col gap-[10px]'>
															{infosCompany.linksInstitutional.map((
																links,
																index,
															) => (
																<a
																	href={links.href}
																	key={index}
																	class='text-neutral-0 text-xs'
																>
																	{links.text}
																</a>
															))}
														</div>
													</li>
												</ul>
											</li>
											<li
												class={`collapse text-gray-100 bg-primary-500 border-b-2 border-white rounded-none h-auto`}
											>
												<input type='checkbox' class='h-14 min-h-[auto]' />
												<p
													class='collapse-title h-14 min-h-[auto]'
													aria-label='Item'
												>
													<span class='text-white font-bold'>
														Redes Sociais
													</span>
												</p>
												<div class='ml-[18px] flex gap-[23px] mb-5'>
													{infosCompany.socialMedia.map((
														social,
														index,
													) => (
														<a
															href={social.href}
															key={index}
															class='bg-white flex items-center justify-center w-[42px] max-w-[42px] h-[42px] max-h-[42px] rounded-full'
														>
															<Icon
																id={social.icon}
																size={24}
																class='text-primary-500'
															/>
															<span class='sr-only'>
																{social.icon}
															</span>
														</a>
													))}
												</div>
											</li>
											<li
												class={`collapse text-gray-100 bg-primary-500 border-b-2 border-white rounded-none h-auto`}
											>
												<input type='checkbox' class='h-14 min-h-[auto]' />
												<p
													class='collapse-title h-14 min-h-[auto]'
													aria-label='Item'
												>
													<span class='text-white font-bold'>
														Pagamento
													</span>
												</p>
												<div class='ml-[18px] flex gap-2 mb-5 flex-wrap'>
													{infosCompany.paymentIcons.map((
														item,
														index,
													) => (
														<div
															key={index}
															class='flex items-center justify-center h-[30px] max-h-[30px] w-[48px] max-w-[48px]'
														>
															<Image
																src={item.image}
																alt={item.alt}
																width={43}
															/>
														</div>
													))}
												</div>
											</li>
											<li
												class={`collapse text-gray-100 bg-primary-500 rounded-none h-auto`}
											>
												<input type='checkbox' class='h-14 min-h-[auto]' />
												<p
													class='collapse-title h-14 min-h-[auto]'
													aria-label='Item'
												>
													<span class='text-white font-bold'>
														Segurança
													</span>
												</p>
												<div class='ml-[18px] flex gap-2 mb-[22px]'>
													{infosCompany.securityImages.map((
														item,
														index,
													) => (
														<a key={index} href={item.href}>
															<Image
																src={item.image}
																alt={item.alt}
																width={65}
															/>
														</a>
													))}
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
							<div class='w-full flex justify-center items-center gap-8 py-5 bg-primary-500 border-t-2 border-t-white'>
								<a href={infosCompany.logoVtex.href}>
									<Image
										src={infosCompany.logoVtex.imageMobile}
										alt={infosCompany.logoVtex.alt}
										width={65}
										height={23}
									/>
								</a>
								<a href={infosCompany.logoDeco.href}>
									<Image
										src={infosCompany.logoDeco.imageMobile}
										alt={infosCompany.logoDeco.alt}
										width={90}
										height={20}
									/>
								</a>
								<a href={infosCompany.logoAgenciaPlus.href}>
									<Image
										src={infosCompany.logoAgenciaPlus.imageMobile}
										alt={infosCompany.logoAgenciaPlus.alt}
										width={111}
										height={21}
									/>
								</a>
							</div>
							<Copyright
								textCopyright={copyrightInfos.textCopyright}
								infoCompany={copyrightInfos.infoCompany}
							/>
						</div>
					</>
				)
				: (
					<>
						{/* Footer Desktop */}
						<div class='hidden lg:flex flex-col font-tt-norms'>
							<div class='bg-primary-500'>
								<div class='container flex lg:flex-row flex-col pb-[50px] lg:justify-center'>
									<div class='flex flex-col items-center w-full max-w-[250px] lg:pr-[50px] lg:pt-[21px]'>
										<div class='flex flex-col items-center mb-[43px] mt-[7px] lg:mt-0'>
											<Image
												src={infosCompany.logo}
												alt={infosCompany.alt}
												width={119}
												height={59}
											/>
											<div class='mt-6'>
												{infosCompany?.openingHours?.map((item, index) => (
													<p
														key={index}
														class='text-xs text-white font-bold text-center'
													>
														{item?.title}
													</p>
												))}
											</div>
											<div class='mt-4'>
												<p class='text-xs text-white font-bold text-center'>
													Dúvidas? Entre em contato:
												</p>
												<p class='text-xs text-white font-bold text-center'>
													{infosCompany.firstPhone} |{' '}
													{infosCompany.secondPhone}
												</p>
												<p class='text-xs text-white font-bold text-center'>
													{infosCompany.email}
												</p>
											</div>
										</div>
										<div class='w-full'>
											<p class='text-white text-sm font-bold'>
												Siga nossas redes
											</p>
											<div class='w-full h-[1px] bg-[#EDE8EC4D] mt-1 mb-[13px]' />
										</div>
										<div class='w-full flex justify-center gap-4'>
											{infosCompany.socialMedia.map((social, index) => (
												<a
													href={social.href}
													key={index}
													class='bg-white flex items-center justify-center w-[28px] max-w-[28px] h-[28px] max-h-[28px] rounded-full'
												>
													<Icon
														id={social.icon}
														size={18}
														class='text-primary-500'
													/>
													<span class='sr-only'>{social.icon}</span>
												</a>
											))}
										</div>
									</div>
									<div class='bg-[#EDE8EC4D] bg-opacity-30 w-[1px] h-[402px] mt-[25px]' />
									<div class='w-full flex flex-col max-w-[800px]'>
										<div class='w-full h-max mt-[25px] pb-[27px] pl-[65px]'>
											<h3 class='text-lg font-bold text-white mb-[38px]'>
												{infosCompany.titleAbout}
											</h3>
											<RenderHTML
												html={infosCompany.about}
												class='text-white text-sm'
											/>
											<div class='w-full h-[1px] bg-[#ede8ec] opacity-30 mt-[21px]' />
										</div>
										<div class='w-full pl-[65px] flex flex-col lg:flex-row justify-between gap-[60px]'>
											<div class='w-full flex flex-col lg:flex-row gap-[30px] justify-between'>
												<div class='w-full'>
													<p class='text-white text-sm font-bold'>
														Para você
													</p>
													<div class='w-full h-[1px] bg-[#ede8ec] opacity-30 mt-1' />
													<div class='flex flex-col mt-3.5 gap-2'>
														{infosCompany.linksForYou.map((
															links,
															index,
														) => (
															<a
																href={links.href}
																key={index}
																class='text-white text-xs whitespace-nowrap'
															>
																{links.text}
															</a>
														))}
													</div>
												</div>
												<div class='w-full'>
													<p class='text-white text-sm font-bold'>
														Institucional
													</p>
													<div class='w-full h-[1px] bg-[#ede8ec] opacity-30 mt-1' />
													<div class='flex flex-col mt-3.5 gap-2'>
														{infosCompany.linksInstitutional.map((
															links,
															index,
														) => (
															<a
																href={links.href}
																key={index}
																class='text-white text-xs whitespace-nowrap'
															>
																{links.text}
															</a>
														))}
													</div>
												</div>
												<div class='w-full'>
													<p class='text-white text-sm font-bold'>
														Informações
													</p>
													<div class='w-full h-[1px] bg-[#ede8ec] opacity-30 mt-1' />
													<div class='flex flex-col mt-3.5 gap-2'>
														{infosCompany.linksInformation.map((
															links,
															index,
														) => (
															<a
																href={links.href}
																key={index}
																class='text-white text-xs whitespace-nowrap'
															>
																{links.text}
															</a>
														))}
													</div>
												</div>
											</div>
											<div class='w-full flex flex-col lg:flex-row gap-[30px] justify-between'>
												<div class='w-full'>
													<p class='text-white text-sm font-bold'>
														Pagamentos
													</p>
													<div class='w-full h-[1px] bg-[#ede8ec] opacity-30 mt-1 mb-[15px]' />
													<div class='grid grid-cols-3 gap-2'>
														{infosCompany.paymentIcons.map((
															item,
															index,
														) => (
															<div
																key={index}
																class='flex items-center justify-center max-h-[30px] max-w-[48px]'
															>
																<Image
																	src={item.image}
																	alt={item.alt}
																	width={43}
																/>
															</div>
														))}
													</div>
												</div>
												<div class='w-full'>
													<p class='text-white text-sm font-bold'>
														Segurança
													</p>
													<div class='w-full h-[1px] bg-[#ede8ec] opacity-30 mt-1 mb-[15px]' />
													<div class='flex flex-col gap-[14px]'>
														{infosCompany.securityImages.map((
															item,
															index,
														) => (
															<a key={index} href={item.href}>
																<Image
																	src={item.image}
																	alt={item.alt}
																	width={65}
																/>
															</a>
														))}
													</div>
												</div>
											</div>
										</div>
										<div class='w-full pl-[65px] mt-[20px] flex items-center gap-8 pb-[51px]'>
											<a href={infosCompany.logoVtex.href}>
												<Image
													src={infosCompany.logoVtex.image}
													alt={infosCompany.logoVtex.alt}
													width={65}
												/>
											</a>
											<a href={infosCompany.logoDeco.href}>
												<Image
													src={infosCompany.logoDeco.image}
													alt={infosCompany.logoDeco.alt}
													width={90}
												/>
											</a>
											<a href={infosCompany.logoAgenciaPlus.href}>
												<Image
													src={infosCompany.logoAgenciaPlus.image}
													alt={infosCompany.logoAgenciaPlus.alt}
													width={111}
												/>
											</a>
										</div>
									</div>
								</div>
							</div>
							<Copyright
								textCopyright={copyrightInfos.textCopyright}
								infoCompany={copyrightInfos.infoCompany}
							/>
						</div>
					</>
				)}
		</>
	)
}
