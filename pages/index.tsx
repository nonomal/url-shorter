import { FormEvent, useState } from 'react'
import type { NextPage } from 'next'
import {
	Box,
	Tab,
	Tabs,
	Link,
	Text,
	Stack,
	Input,
	Spacer,
	Button,
	VStack,
	TabList,
	Heading,
	TabPanel,
	TabPanels,
	FormLabel,
	FormControl,
	useClipboard,
	useToast,
	AlertStatus,
} from '@chakra-ui/react'
import isUrl from 'is-url'
import { Check, Copy, Info, LinkOne } from '@icon-park/react'
import { Layout } from '../components/layout'
import { TrackerTab } from '../components/track/TrackerTab'

const Shorter = () => {
	const [longUrl, setLongUrl] = useState<string>('')
	const [shorterUrl, setShorterUrl] = useState<string>('')
	const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false)

	const { hasCopied, onCopy } = useClipboard(shorterUrl)
	const toast = useToast()

	const alertToast = (title:string, status:AlertStatus) => {
		toast({
			title: title,
			status: status,
			duration: 3000,
			position: 'top',
			isClosable: true,
		})
	}

	const handleSubmit = (e:FormEvent) => {
		e.preventDefault()
		setShorterUrl('')
		setIsBtnLoading(true)
		fetch(`/api/short`, {
			method: 'POST',
			body: JSON.stringify({ longUrl: longUrl }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				setIsBtnLoading(false)
				if (res.status !== 201) {
					alertToast('Short Url Error', 'error')
					return
				}
				res.json().then((dataRes) => {
					const { url } = dataRes
					alertToast('Success', 'success')
					setShorterUrl(url)
				})
			})
			.catch(() => {
				alertToast('Short Url Error', 'error')
				setIsBtnLoading(false)
			})
	}

	return (
		<VStack spacing={10}>
			<Heading>URL Shorter</Heading>
			<FormControl
				w={{ base: 'xs', sm: 'sm', md: 'md', lg: 'lg' }}
				rounded="lg"
				borderStyle="dotted"
				borderWidth="3px"
				p={{ base: 3, md: 7, }}
			>
				<FormLabel>
					URL:
				</FormLabel>
				<Input
					type="url"
					value={longUrl}
					onChange={(e) => {setLongUrl(e.target.value)}}
				/>
				<Button
					type="submit"
					onClick={handleSubmit}
					isLoading={isBtnLoading}
					colorScheme="blue"
					mt={3}
					disabled={!isUrl(longUrl)}
				>
					Submit
				</Button>
			</FormControl>
			{shorterUrl.length > 0
				? <>
					<Text fontSize="lg">
						shorter url
					</Text>
					<Box
						w={{ base: 'xs', sm: 'sm', md: 'md', lg: '3xl' }}
						p={{ base: 3, md: 7, }}
						rounded="lg"
						borderStyle="dotted"
						borderWidth="3px"
					>
						<Stack
							direction={{ base: 'column', md: 'row' }}
							alignItems="center"
							textAlign="center"
						>
							<Link href={shorterUrl} color="blue.500" isExternal>
								{shorterUrl}
							</Link>
							<Spacer />
							<Button
								w={{ base: '3xs', md: '25%' }}
								p={3}
								onClick={onCopy}
								leftIcon={hasCopied ? <Check fill="#7ed321" /> : <Copy />}
							>
								{hasCopied ? 'Copied' : 'Copy'}
							</Button>
						</Stack>
					</Box>
				</>
				: null
			}
		</VStack>
	)
}

const Home:NextPage = () => {
	return (
		<Layout>
			<Tabs isFitted variant="enclosed" maxW={'5xl'} mx={'auto'} mt={7}>
				<TabList mb="1rem">
					<Tab>
						<LinkOne />
						<Text ml={3}>
							Shorter
						</Text>
					</Tab>
					<Tab>
						<Info />
						<Text ml={3}>
							Tracker
						</Text>
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<Shorter />
					</TabPanel>
					<TabPanel>
						<TrackerTab />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Layout>
	)
}

export default Home
