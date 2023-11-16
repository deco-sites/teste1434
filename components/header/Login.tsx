import Icon from '$store/components/ui/Icon.tsx'
import { useUser } from 'apps/vtex/hooks/useUser.ts'
// import type { User } from 'apps/vtex/loaders/user.ts'

function Login() {
	const { user } = useUser()
	const isLoggedIn = !!user.value?.email

	return (
		<div
			data-logged={isLoggedIn}
			className='group relative'
		>
			<label tabIndex={0} className='block pb-4 -mb-4'>
				<a
					class='flex items-center gap-2 group text-neutral-0'
					href={isLoggedIn ? '/_secure/account#/profile' : '/account'}
				>
					{/* Desktop Icon */}
					<Icon
						id='User'
						class='hidden lg:flex flex-shrink-0 text-white header-icon brightness-100 lg:group-data-[micro-header="true"]/header:!brightness-0'
						width={24}
						height={24}
					/>
					{/* Mobile Icon */}
					<Icon
						id='User'
						class='flex lg:hidden flex-shrink-0 text-neutral-0 brightness-100 lg:group-data-[micro-header="true"]/header:!brightness-0'
						width={24}
						height={24}
					/>

					<div class='text-gray-600 text-sm whitespace-nowrap'>
						{isLoggedIn ? user.value?.email : (
							<>
								{/* Desktop Text */}
								<p class='hidden lg:block text-login-text group-data-[micro-header="true"]/header:text-neutral-0'>
									LOGIN
								</p>
								{/* Mobile Text */}
								<p class='block lg:hidden text-neutral-0'>
									LOGIN
								</p>
							</>
						)}
					</div>
				</a>
			</label>

			<ul
				tabIndex={0}
				className='group-data-[logged=false]:!hidden bg-gray-100 w-full text-sm text-gray-500 xl:hidden xl:group-hover:block xl:absolute xl:p-3 xl:top-12  xl:right-1/2 xl:translate-x-1/2  xl:box-shadow-dropdown xl:z-[1] xl:rounded-md'
			>
				<div>
					<li class='hover:bg-gray-300 w-full justify-center hidden xl:flex'>
						<a
							aria-label='Minha conta'
							class='block p-2'
							href='/_secure/account#/profile'
						>
							Minha conta
						</a>
					</li>
					<li class='hover:bg-gray-300 w-full justify-center hidden xl:flex'>
						<a
							aria-label='Meus pedidos'
							class='block p-2'
							href='/_secure/account#/orders'
						>
							Meus pedidos
						</a>
					</li>
					<li class='hover:bg-gray-300 flex w-full xl:justify-center text-danger-500'>
						<a
							aria-label='Sair'
							class='flex items-center xl:justify-center w-full pt-4 xl:p-2'
							href={`/api/vtexid/pub/logout?scope=lfante&returnUrl=${window.location?.href}`}
						>
							Sair
						</a>
					</li>
				</div>
			</ul>
		</div>
	)
}

export default Login
