import { AppProps } from '$fresh/server.ts'
import GlobalTags from '$store/components/GlobalTags.tsx'
import Theme from '$store/sections/Theme/Theme.tsx'
import { Head } from '$fresh/runtime.ts'

const sw = () =>
	addEventListener('load', () =>
		navigator && navigator.serviceWorker &&
		navigator.serviceWorker.register('/sw.js'))

function App(props: AppProps) {
	const isHomePage = props.url.pathname === '/'

	return (
		<>
			{/* Include default fonts and css vars */}
			<Theme />

			{/* Include Icons and manifest */}
			<GlobalTags />

			{/* Rest of Preact tree */}
			<props.Component />

			{/* Include service worker */}
			<script
				type='module'
				dangerouslySetInnerHTML={{ __html: `(${sw})();` }}
			/>
		</>
	)
}

export default App
