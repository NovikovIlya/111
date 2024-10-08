import { Typography } from 'antd'
import { FC } from 'react'

import { CloseSvg, EmailFillSvg, PhoneFillSvg } from '../../../../assets/svg'

import styles from './Title.module.scss'

interface ITitleFaqProps {
	showChildrenDrawer: () => void
	onClose: () => void
}

const { Text, Link } = Typography

export const TitleFaq: FC<ITitleFaqProps> = ({ onClose }) => {
	return (
		<div className={styles.main}>
			<h3 className={styles.title}>Support Center</h3>
			<span className="flex gap-1 justify-center items-center">
				<Text className={styles.work}>
					We work from Mon - Fri, 8:00 - 18:00
				</Text>
				<div onClick={onClose} className={styles.close}>
					<CloseSvg />
				</div>
			</span>
			<div className={styles.buttons}>
				<div className="cursor-pointer bg-darkblue flex  justify-center rounded-full w-[5vh] h-[5vh] p-[1.5vh]">
					<Link href="mailto:deshelp@kpfu.ru" className="w-[5vh] h-[5vh]">
						<EmailFillSvg />
					</Link>
				</div>
				<div className="cursor-pointer bg-darkblue flex justify-center w-[5vh] h-[5vh] rounded-full p-[1.5vh]">
					<Link href="tel:+7 (843) 206-50-84" className="w-[5vh] h-[5vh]">
						<PhoneFillSvg />
					</Link>
				</div>
			</div>
		</div>
	)
}
