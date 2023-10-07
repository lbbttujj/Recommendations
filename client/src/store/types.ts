import React from 'react'

export type DirectoryType = {
	id: string
	user_id: number
	dir_name: string
	dir_type: string
}

export type FilmType = {
	id: string
	kp_id: number
	dir_id: string
	img_url: string
	name: string
	description: string
}

export type Film2Type = {
	id: number
	name: string
	shortDescription: string
	poster: {
		previewUrl: string
	}
}

export interface DirState {
	dirId: string
	dirName: string
}
