import { Form, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { IRegForm } from '../../api/types'
import logo from '../../assets/images/group.png'
import { useAppDispatch } from '../../store'
import { RootState } from '../../store'
import { registerUser } from '../../store/creators/MainCreators'
import { clearRegistrationErrors } from '../../store/creators/SomeCreators'
import { BackMainPage } from '../back-main-page/BackMainPage'

import styles from './Registration.module.scss'
import { Buttons } from './buttons/Buttons'
import { Inputs } from './inputs/Inputs'
import { Password } from './password/Password'

const { Title } = Typography

interface IRegProps {
	changeEmail: (email: string) => void
	email: string
}

export const Registration: FC<IRegProps> = ({ changeEmail, email }) => {
	const navigate = useNavigate()
	const dispatch = useAppDispatch()
	const error = useSelector((state: RootState) => state.AuthReg.regData.error)
	const { t } = useTranslation()
	const [check, setCheck] = useState(false)
	const [confirmPassword, setConfirmPassword] = useState(false)

	useEffect(() => {
		dispatch(clearRegistrationErrors())
	}, [])

	const onFinish = async (values: IRegForm) => {
		if (confirmPassword) {
			if (values.email || values.name || values.password) {
				const response = await registerUser(
					{
						lastName: values.surname,
						password: values.password,
						middleName: !values.middleName ? null : values.middleName,
						firstName: values.name,
						email: values.email,
						agreement: 'true'
					},
					dispatch
				)
				if (response === 200) navigate('/registration/checkingEmail')
			}
		}
	}

	return (
		<div className={styles.wrapper}>
			<BackMainPage />
			<div className={styles.main}>
				<Form
					name="login"
					className={styles.loginForm}
					initialValues={{ remember: true }}
					onFinish={e => onFinish(e)}
				>
					<Title className={styles.title}>{t('registration')}</Title>
					<Inputs error={error} changeEmail={changeEmail} />
					<Password
						error={error}
						confirmPassword={confirmPassword}
						setConfirmPassword={setConfirmPassword}
					/>
					<Buttons check={check} setCheck={setCheck} />
				</Form>
				<div className="flex items-start mt-10">
					<img
						className="max-lg:hidden w-[400px] h-[400px]"
						src={logo}
						alt="group"
					/>
				</div>
			</div>
		</div>
	)
}
