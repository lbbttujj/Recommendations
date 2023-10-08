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

export type VkUsers = {
	can_access_closed: boolean
	first_name: string
	id: number
	is_closed: boolean
	last_name: string
	photo_50: string
	track_code: string
}
