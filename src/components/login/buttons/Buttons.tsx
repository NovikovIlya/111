import { Button, Form } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { useAppDispatch } from '../../../store'
import { clearLoginErrors } from '../../../store/creators/SomeCreators'

import styles from './Buttons.module.scss'

export const Buttons = () => {
	const dispatch = useAppDispatch()
	const { t } = useTranslation()
	return (
		<Form.Item>
			<div className={styles.buttons}>
				<Button
					className={styles.login}
					size="large"
					type="primary"
					htmlType="submit"
				>
					{t('enter')}
				</Button>

				<div className={styles.reg}>
					<span>
						{t('noProfile')}{' '}
						<Link
							className={styles.link}
							to="/registration"
							onClick={() => dispatch(clearLoginErrors())}
						>
							{t('register')}
						</Link>
					</span>
					<Link to={'https://kpfu.ru/'} className={styles.kpfu}>
						kpfu.ru
					</Link>
				</div>
			</div>
		</Form.Item>
	)
}
