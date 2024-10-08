import { QuestionOutlined, UploadOutlined } from '@ant-design/icons'
import {
	Button,
	ConfigProvider,
	DatePicker,
	Input,
	Select,
	Space,
	Tooltip,
	Typography,
	Upload,
	message
} from 'antd'
import type { UploadProps } from 'antd'
import enPicker from 'antd/locale/en_US'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { RootState, useAppSelector } from '../../../store'
import {
	getDocumentItemRequest,
	postDocumentItemRequest
} from '../../../store/creators/MainCreators'
import {
	allData,
	dateIssue,
	divisionCode,
	documentTypeId,
	inn,
	issuedBy,
	passportNumber,
	passportSeries,
	snils
} from '../../../store/reducers/FormReducers/DocumentReducer'
import { useGetDocumentsQuery } from '../../../store/slice/documentSlice'

const props: UploadProps = {
	name: 'file',
	action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
	headers: {
		authorization: 'authorization-text'
	},
	onChange(info) {
		if (info.file.status !== 'uploading') {
			console.log(info.file, info.fileList)
		}
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`)
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`)
		}
	}
}
export const Document = () => {
	const navigate = useNavigate()
	const { t } = useTranslation()
	dayjs.locale('en')
	const dispatch = useDispatch()

	const [IsEmpty, changeIsEmpty] = useState<boolean>(false)
	const role = useAppSelector(state => state.InfoUser?.role)
	const documentData = useAppSelector((state: RootState) => state.Document)
	const { data: documents } = useGetDocumentsQuery()

	const getData = async () => {
		const response = await getDocumentItemRequest(dispatch)
		if (typeof response !== 'number') {
			dispatch(
				allData({
					documentTypeId: !response.documentTypeId
						? 2
						: response.documentTypeId,
					passportSeries: !response.passportSeries
						? ''
						: response.passportSeries,
					passportNumber: !response.passportNumber
						? ''
						: response.passportNumber,
					issuedBy: !response.issuedBy ? '' : response.issuedBy,
					dateIssue: !response.dateIssue ? '' : response.dateIssue,
					divisionCode: !response.divisionCode ? '' : response.divisionCode,
					inn: !response.inn ? '' : response.inn,
					snils: !response.snils ? '' : response.snils
				})
			)
		}
		if (response === 403) navigate('/')
	}

	useEffect(() => {
		if (!documentData.inn) getData()
	}, [])

	const handleAddDocument = async () => {
		const IsCorrectNumber = /^[0-9]{4}$/.test(documentData.passportNumber)
		const IsCorrectSeries =
			/^[0-9]{4}$/.test(documentData.passportSeries) ||
			!documentData.passportSeries
		const IsCorrectSNILS =
			/^[0-9]{3}\-[0-9]{3}\-[0-9]{3} [0-9]{2}$/.test(documentData.snils) ||
			!documentData.snils
		const IsCorrectDivisionCode =
			/^[0-9]{3}\-[0-9]{3}$/.test(documentData.divisionCode) ||
			!documentData.divisionCode
		const IsCorrectINN =
			/^[0-9]{12}$/.test(documentData.inn) || !documentData.inn
		const IsCorrectWhomIssued =
			!/\s\s/.test(documentData.issuedBy) &&
			/^[\p{L}\s]+$/u.test(documentData.issuedBy)
		if (
			!IsCorrectNumber ||
			!IsCorrectSeries ||
			!IsCorrectSNILS ||
			!IsCorrectINN ||
			!IsCorrectDivisionCode ||
			documentData.dateIssue === '' ||
			!IsCorrectWhomIssued
		) {
			changeIsEmpty(true)
			return false
		}
		const response = await postDocumentItemRequest(documentData, dispatch)
		if (response === 200) changeIsEmpty(false)
		if (response === 404) changeIsEmpty(true)
		if (response === 403) navigate('/')
	}
	const isStudent = role === 'STUD'

	return (
		<div className="m-14 radio">
			<Space direction="vertical" size={20}>
				<Typography.Title level={3}>{t('documents')}</Typography.Title>

				<Space direction="vertical" size={'small'}>
					<Typography.Text>{t('documentType')}</Typography.Text>
					<Select
						onChange={e => {
							dispatch(documentTypeId(e))
						}}
						disabled={isStudent}
						placeholder={t('rf')}
						size="large"
						className="w-[624px] shadow rounded-lg"
						options={
							!documents
								? []
								: documents.map(el => ({ value: el.id, label: el.type }))
						}
						value={documentData.documentTypeId}
					/>
				</Space>

				<Typography.Text className="text-black text-sm font-bold">
					{t('documentInfo')}
				</Typography.Text>

				<Space size={'large'}>
					<Space direction="vertical" className="w-[300px]">
						<Typography.Text>{t('divisionCode')}</Typography.Text>
						<Input
							disabled={isStudent}
							placeholder="000-000"
							size="large"
							value={documentData.divisionCode}
							className={clsx(
								'shadow w-full',
								IsEmpty &&
									documentData.divisionCode &&
									!/^[0-9]{3}\-[0-9]{3}$/.test(documentData.divisionCode) &&
									'border-rose-500'
							)}
							maxLength={7}
							onChange={e => dispatch(divisionCode(e.currentTarget.value))}
						/>
						{IsEmpty &&
							documentData.divisionCode &&
							!/^[0-9]{3}\-[0-9]{3}$/.test(documentData.divisionCode) && (
								<span className="text-red-500 text-sm">
									{t('BadDivisionCode')}
								</span>
							)}
					</Space>
					<Space direction="vertical" className="w-[300px]">
						<Typography.Text>{t('whenIssued')}</Typography.Text>
						<ConfigProvider locale={enPicker}>
							<DatePicker
								disabled={isStudent}
								className={clsx(
									'shadow w-full',
									IsEmpty && documentData.dateIssue === '' && 'border-rose-500'
								)}
								onChange={e =>
									dispatch(dateIssue(e == null ? '' : e?.format('YYYY-MM-DD')))
								}
								size="large"
								placeholder={t('date')}
								format={'DD.MM.YYYY'}
								value={
									documentData.dateIssue !== ''
										? dayjs(
												documentData.dateIssue.split('-').reverse().join('.'),
												'DD.MM.YYYY'
										  )
										: null
								}
							/>
						</ConfigProvider>
						{IsEmpty && documentData.dateIssue === '' && (
							<div className="text-red-500 text-sm">{t('DateError')}</div>
						)}
					</Space>
				</Space>

				<Space size={'large'}>
					<Space direction="vertical" className="w-[300px]">
						<Typography.Text>{t('series')}</Typography.Text>
						<Input
							disabled={isStudent}
							placeholder="0000"
							size="large"
							className={clsx(
								'shadow ',
								IsEmpty &&
									documentData.passportSeries &&
									!/^[0-9]{4}$/.test(documentData.passportSeries) &&
									'border-rose-500'
							)}
							maxLength={4}
							onChange={e => dispatch(passportSeries(e.target.value))}
							value={
								documentData.passportSeries !== ''
									? documentData.passportSeries
									: ''
							}
						/>
						{IsEmpty &&
							documentData.passportSeries &&
							!/^[0-9]{4}$/.test(documentData.passportSeries) && (
								<span className="text-red-500 text-sm">{t('BadPassport')}</span>
							)}
					</Space>
					<Space direction="vertical" className="w-[300px]">
						<Typography.Text>{t('number')}</Typography.Text>
						<Input
							disabled={isStudent}
							placeholder="0000"
							size="large"
							className={clsx(
								'shadow',
								IsEmpty &&
									!/^[0-9]{4}$/.test(documentData.passportNumber) &&
									'border-rose-500'
							)}
							maxLength={200}
							onChange={e => dispatch(passportNumber(e.target.value))}
							value={
								documentData.passportNumber !== ''
									? documentData.passportNumber
									: ''
							}
						/>
						{IsEmpty && !/^[0-9]{4}$/.test(documentData.passportNumber) && (
							<span className="text-red-500 text-sm">{t('BadPassport')}</span>
						)}
					</Space>
				</Space>

				<Space direction="vertical" size={'small'} className="w-full ">
					<Typography.Text>{t('issuedWhom')}</Typography.Text>
					<Input
						disabled={isStudent}
						placeholder={t('location')}
						size="large"
						maxLength={200}
						className={clsx(
							'shadow',
							IsEmpty &&
								(!/^[\p{L}\s]+$/u.test(documentData.issuedBy) ||
									/\s\s/.test(documentData.issuedBy)) &&
								'border-rose-500'
						)}
						onChange={e => dispatch(issuedBy(e.target.value))}
						value={documentData.issuedBy !== '' ? documentData.issuedBy : ''}
					/>
					{IsEmpty &&
						(!/^[\p{L}\s]+$/u.test(documentData.issuedBy) ||
							/\s\s/.test(documentData.issuedBy)) && (
							<span className="text-red-500 text-sm">{t('EmptyFolder')}</span>
						)}
				</Space>

				<Typography.Text className="text-black text-sm font-bold">
					{t('documentInfo')}
				</Typography.Text>

				<Space direction="vertical" size={'small'} className="w-full">
					<Typography.Text>{t('snils')}</Typography.Text>
					<Input
						disabled={isStudent}
						size="large"
						placeholder="000-000-000 00"
						className={clsx(
							'shadow ',
							IsEmpty &&
								documentData.snils &&
								!/^[0-9]{3}\-[0-9]{3}\-[0-9]{3} [0-9]{2}$/.test(
									documentData.snils
								) &&
								'border-rose-500'
						)}
						maxLength={14}
						onChange={e => dispatch(snils(e.target.value))}
						value={documentData.snils}
					/>
					{IsEmpty &&
						documentData.snils &&
						!/^[0-9]{3}\-[0-9]{3}\-[0-9]{3} [0-9]{2}$/.test(
							documentData.snils
						) && <span className="text-red-500 text-sm">{t('BadSnils')}</span>}
				</Space>
				<Space direction="vertical" size={'small'} className="w-full">
					<Typography.Text>{t('inn')}</Typography.Text>
					<Input
						disabled={isStudent}
						size="large"
						placeholder="000000000000"
						maxLength={12}
						className={clsx(
							'shadow ',
							IsEmpty &&
								documentData.inn &&
								!/^[0-9]{12}$/.test(documentData.inn) &&
								'border-rose-500'
						)}
						onChange={e => dispatch(inn(e.target.value))}
						value={documentData.inn}
					/>
					{IsEmpty &&
						documentData.inn &&
						!/^[0-9]{12}$/.test(documentData.inn) && (
							<span className="text-red-500 text-sm">{t('BadInn')}</span>
						)}
				</Space>
				<Space size={'small'} className={clsx(isStudent && 'hidden')}>
					<Typography.Text className="text-black opacity-80 text-sm font-normal leading-none">
						{t('AttachDocuments')}
					</Typography.Text>
					<Tooltip title={t('AttachDocumentsDescription')}>
						<Button
							type="default"
							className="bg-transparent"
							icon={<QuestionOutlined className="text-xs" />}
						/>
					</Tooltip>
				</Space>

				<Upload {...props} className={clsx(isStudent && 'hidden')}>
					<Button icon={<UploadOutlined />}>{t('AddFile')}</Button>
				</Upload>
				<Space
					direction="vertical"
					size={'small'}
					className={clsx('mt-4', isStudent && 'hidden')}
				>
					<Button
						className="border-solid border-bluekfu border-[1px] text-bluekfu rounded-md"
						onClick={handleAddDocument}
					>
						{t('edit')}
					</Button>
				</Space>
			</Space>
		</div>
	)
}
