import React from 'react'

// Types
import { ReactNode } from 'react'

export const Table = ({ children }: IProps) => {
	return <div>{children}</div>
}

interface IProps {
	children: ReactNode
}
