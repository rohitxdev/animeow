import { ReactComponent as DiscordLogoIcon } from '@assets/icons/logo-discord.svg';
import { ReactComponent as GithubLogoIcon } from '@assets/icons/logo-github.svg';
import buyMeAcoffeeSrc from '@assets/images/buy-me-a-coffee.png';

import styles from './footer.module.scss';

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<span className={styles.socialMediaLinks}>
				<a
					href="https://github.com/rohitreddygr8/animeow"
					title="Github"
					target="_blank"
				>
					<GithubLogoIcon />
				</a>
				<a
					href="https://discordapp.com/users/457773058770599947"
					title="Discord"
					target="_blank"
				>
					<DiscordLogoIcon />
				</a>
				<a
					href="https://ko-fi.com/optimistic_primate"
					title="Buy me a coffee"
					target="_blank"
				>
					<img src={buyMeAcoffeeSrc} />
				</a>
			</span>
			<p>
				Built with&nbsp;&nbsp;
				<a
					className={styles.enimeLink}
					href="https://api.enime.moe"
					target="_blank"
				>
					Enime API
				</a>
			</p>
			<p>
				ANIMEOW is not affiliated with or endorsed by any of the anime studios
				behind the creation of the anime presented on this site. This website is
				only an user interface presenting/linking various self-hosted files
				across the internet by other third-party providers for easy access.
			</p>
		</footer>
	);
};
