// contains all the requests that go to the API

import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { PaginatedResult } from '../models/pagination';
import { User, UserFormValues } from '../models/user';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { Announcement, AnnouncementFormValues } from '../models/announcement';
import { Profile } from '../models/profile';
import { Puzzle, PuzzleFormValues } from '../models/puzzle';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = 'http://localhost:5174/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    if (process.env.NODE_ENV === 'development') await sleep(1000);
    const pagination = response.headers['pagination'];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                router.navigate('/not-found');
            }
            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                toast.error(data);
            }
            break;
        case 401:
            toast.error('Не сте влезли в профила си!')
            break;
        case 403:
            toast.error('Нямате достъп до този ресурс!')
            break;
        case 404:
            console.log("Това е полето data:", data)
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T>(url: string) => axios.delete<T>(url).then(responseBody)
}

const Account = {
    current: () => requests.get<User>('account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Announcements = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Announcement[]>>('/announcements', { params }).then(responseBody),
    details: (id: string) => requests.get<Announcement>(`/announcements/${id}`),
    create: async (announcement: AnnouncementFormValues, file: Blob) => {
        let formData = new FormData();
        formData.append('Title', announcement.title);
        formData.append('Description', announcement.description);
        formData.append('Text', announcement.text);
        formData.append('MainImage', file);
        const response = await axios.post('/announcements', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return responseBody(response);
    },
    update: async (announcement: AnnouncementFormValues, file: Blob) => {
        let formData = new FormData();
        formData.append('Title', announcement.title);
        formData.append('Description', announcement.description);
        formData.append('Text', announcement.text);
        formData.append('MainImage', file);

        await axios.put(`/announcements/${announcement.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    delete: (id: string) => requests.del<void>(`/announcements/${id}`),
}

const Puzzles = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Puzzle[]>>('/puzzles', { params }).then(responseBody),
    details: (id: number) => requests.get<Puzzle>(`/puzzles/${id}`),
    create: async (puzzle: PuzzleFormValues, file: Blob) => {
        let formData = new FormData();
        formData.append('Title', puzzle.title);
        formData.append('Description', puzzle.description);
        formData.append('Solution', puzzle.solution);
        formData.append('Points', puzzle.points.toString());
        formData.append('Difficulty', puzzle.difficulty);
        formData.append('Image', file);
        const response = await axios.post('/puzzles', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return responseBody(response);
    },
    update: async (puzzle: PuzzleFormValues, file: Blob) => {
        let formData = new FormData();
        formData.append('Title', puzzle.title);
        formData.append('Description', puzzle.description);
        formData.append('Solution', puzzle.solution);
        formData.append('Points', puzzle.points.toString());
        formData.append('Difficulty', puzzle.difficulty);
        formData.append('Image', file);

        await axios.put(`/puzzles/${puzzle.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    delete: (id: number) => requests.del<void>(`/puzzles/${id}`),
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
}

const agent = {
    Announcements,
    Account,
    Puzzles,
    Profiles
}

function populateFormValues(){

}

export default agent;