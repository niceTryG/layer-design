import { useEffect, useMemo, useRef, useState } from 'react';
import { BiLogoLinkedin } from 'react-icons/bi';
import {
  SiFacebook,
  SiInstagram,
  SiTelegram,
  SiX,
  SiYoutube,
} from 'react-icons/si';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

const toImageUrl = (src) => {
  if (!src || typeof src !== 'string') return '';
  return src.startsWith('/uploads') ? `${BACKEND_ORIGIN}${src}` : src;
};

const ADMIN_I18N = {
  uz: {
    dashboard: 'Admin boshqaruv paneli',
    subtitle: 'Kontentni tez va aniq boshqaring',
    connected: 'Server bilan boglangan',
    logout: 'Chiqish',
    language: 'Til',
    loading: 'Panel yuklanmoqda...',
    search: 'Qidiruv',
    searchPlaceholder: 'Nom, kalit yoki URL boyicha qidiring...',
    noResults: 'Mos natija topilmadi.',
    tabs: {
      projects: 'Loyihalar',
      gallery: 'Galereya',
      team: 'Jamoa',
      partners: 'Hamkorlar',
      info: 'Aloqa',
    },
    tabHints: {
      projects: 'Loyiha kartalari, asosiy rasm va ichki galereyani boshqarish',
      gallery: 'Umumiy galereya rasmlarini saqlash va tozalash',
      team: 'Jamoa azolarini qoshish va yangilash',
      partners: 'Brend hamkorlar royxatini yuritish',
      info: 'Kontaktlar va ijtimoiy havolalarni boshqarish',
    },
    stats: {
      projects: 'Loyihalar',
      images: 'Rasmlar',
      team: 'Jamoa',
      links: 'Aloqa/Havola',
    },
    common: {
      add: 'Qoshish',
      update: 'Yangilash',
      edit: 'Tahrirlash',
      delete: 'Ochirish',
      cancel: 'Bekor qilish',
      save: 'Saqlash',
      required: 'Majburiy',
      empty: 'Hozircha malumot yoq.',
      listCount: 'Jami',
      chooseHint: 'Fayl yoki URL tanlang (fayl ustuvor)',
    },
    projects: {
      addTitle: 'Yangi loyiha',
      editTitle: 'Loyihani tahrirlash',
      listTitle: 'Loyihalar royxati',
      galleryTitle: 'Loyiha ichki galereyasi',
      galleryLayout: 'Galereya layouti',
      galleryAuto: 'Auto',
      galleryLandscape: 'Keng',
      galleryPortrait: 'Portret',
      galleryLivePreview: 'Galereya live preview',
      moveUp: 'Yuqoriga',
      moveDown: 'Pastga',
      updateGallery: 'Galereyani yangilash',
      title: 'Nomi',
      subtitle: 'Qisqa sarlavha',
      location: 'Joylashuv',
      style: 'Stil',
      image: 'Asosiy rasm',
      gridSize: 'Grid o`lchami',
      gridAuto: 'Auto (aqlli)',
      gridNormal: 'Normal',
      gridWide: 'Keng',
      gridTall: 'Baland',
      livePreview: 'Live preview',
      description: 'Tavsif',
      addGallery: 'Galereyaga rasm qoshish',
      noGallery: 'Bu loyiha uchun hali galereya rasmlari yoq.',
    },
    gallery: {
      addTitle: 'Galereya rasmi qoshish',
      listTitle: 'Galereya royxati',
      imageUrl: 'Rasm URL',
    },
    team: {
      addTitle: 'Jamoa azosi qoshish',
      listTitle: 'Jamoa royxati',
      name: 'Ism',
      role: 'Lavozim',
      photo: 'Rasm',
    },
    partners: {
      addTitle: 'Hamkor qoshish',
      listTitle: 'Hamkorlar royxati',
      name: 'Hamkor nomi',
      url: 'Havola (ixtiyoriy)',
    },
    info: {
      addTitle: 'Aloqa elementi qoshish',
      editTitle: 'Aloqa elementini tahrirlash',
      listTitle: 'Aloqa va havolalar',
      key: 'Kalit (unique)',
      title: 'Sarlavha',
      value: 'Qiymat',
      type: 'Turi',
      emoji: 'Emoji (zaxira)',
      url: 'URL',
      presets: 'Tez app shablonlari',
      presetHint: 'Bitta app tanlasangiz key, title va URL bazasi avtomatik toldiriladi',
      iconPreview: 'Icon preview',
      typeText: 'Matn',
      typeEmail: 'Email',
      typePhone: 'Telefon',
      typeSocial: 'Ijtimoiy havola',
      typeUrl: 'Havola',
    },
    placeholders: {
      projectTitle: 'Masalan, APEX Tower',
      projectSubtitle: 'Masalan, Exterior',
      projectLocation: 'Masalan, Dubai, UAE',
      projectStyle: 'Masalan, Modern',
      projectDescription: 'Loyiha haqida qisqa malumot...',
      projectPreviewSubtitle: 'Kartadagi subtitle',
      url: 'https://...',
      teamName: 'Toliq ism',
      teamRole: 'Masalan, Principal Architect',
      partnerName: 'Brend nomi',
      partnerUrl: 'https://example.com',
      infoKey: 'Masalan, email, phone, instagram',
      infoTitle: 'Masalan, Email',
      infoValue: 'Masalan, hello@example.com',
    },
    confirms: {
      deleteProject: 'Ushbu loyihani ochirasizmi?',
      deleteProjectGallery: 'Ushbu galereya rasmini ochirasizmi?',
      deleteGallery: 'Ushbu rasmni ochirasizmi?',
      deleteTeam: 'Ushbu jamoa azosini ochirasizmi?',
      deletePartner: 'Ushbu hamkorni ochirasizmi?',
      deleteInfo: 'Ushbu aloqa elementini ochirasizmi?',
    },
    messages: {
      loadFail: 'Malumotlarni yuklashda xatolik',
      titleRequired: 'Loyiha nomi majburiy',
      projectImageRequired: 'Loyiha rasmi (fayl yoki URL) majburiy',
      projectAdded: 'Loyiha muvaffaqiyatli qoshildi',
      projectUpdated: 'Loyiha muvaffaqiyatli yangilandi',
      projectSaveFail: 'Loyihani saqlashda xatolik',
      projectDeleted: 'Loyiha ochirildi',
      projectDeleteFail: 'Loyihani ochirishda xatolik',
      noProjectSelected: 'Loyiha tanlanmagan',
      projectGalleryImageRequired: 'Galereya rasmi (fayl yoki URL) majburiy',
      projectGalleryAdded: 'Galereyaga rasm qoshildi',
      projectGalleryAddFail: 'Galereyaga rasm qoshilmadi',
      projectGalleryDeleted: 'Galereya rasmi ochirildi',
      projectGalleryDeleteFail: 'Galereya rasmini ochirishda xatolik',
      projectGalleryLayoutSaved: 'Galereya layouti saqlandi',
      projectGalleryLayoutSaveFail: 'Galereya layoutini saqlashda xatolik',
      projectGalleryOrderSaved: 'Galereya tartibi saqlandi',
      projectGalleryOrderSaveFail: 'Galereya tartibini saqlashda xatolik',
      galleryUrlRequired: 'Rasm URL majburiy',
      galleryAdded: 'Galereyaga rasm qoshildi',
      galleryDeleted: 'Rasm ochirildi',
      galleryDeleteFail: 'Rasmni ochirishda xatolik',
      teamRequired: 'Ism va lavozim majburiy',
      teamAdded: 'Jamoa azosi qoshildi',
      teamDeleted: 'Jamoa azosi ochirildi',
      teamDeleteFail: 'Jamoa azosini ochirishda xatolik',
      partnerRequired: 'Hamkor nomi majburiy',
      partnerAdded: 'Hamkor qoshildi',
      partnerDeleted: 'Hamkor ochirildi',
      partnerDeleteFail: 'Hamkorni ochirishda xatolik',
      infoRequired: 'Key va title majburiy',
      infoAdded: 'Aloqa elementi qoshildi',
      infoUpdated: 'Aloqa elementi yangilandi',
      infoDeleted: 'Aloqa elementi ochirildi',
      infoDeleteFail: 'Aloqa elementini ochirishda xatolik',
      sessionExpired: 'Sessiya tugadi. Qayta kiring.',
      genericError: 'Xatolik yuz berdi',
    },
  },
  ru: {
    dashboard: 'Панель администратора',
    subtitle: 'Удобное управление контентом сайта',
    connected: 'Сервер подключен',
    logout: 'Выйти',
    language: 'Язык',
    loading: 'Загрузка панели...',
    search: 'Поиск',
    searchPlaceholder: 'Поиск по названию, ключу или URL...',
    noResults: 'Подходящих результатов не найдено.',
    tabs: {
      projects: 'Проекты',
      gallery: 'Галерея',
      team: 'Команда',
      partners: 'Партнеры',
      info: 'Контакты',
    },
    tabHints: {
      projects: 'Управление карточками проектов, главным изображением и галереей',
      gallery: 'Добавление и очистка общей галереи изображений',
      team: 'Добавление и удаление участников команды',
      partners: 'Ведение списка брендов-партнеров',
      info: 'Управление контактами и социальными ссылками',
    },
    stats: {
      projects: 'Проекты',
      images: 'Изображения',
      team: 'Команда',
      links: 'Контакты/Ссылки',
    },
    common: {
      add: 'Добавить',
      update: 'Обновить',
      edit: 'Редактировать',
      delete: 'Удалить',
      cancel: 'Отмена',
      save: 'Сохранить',
      required: 'Обязательно',
      empty: 'Пока нет данных.',
      listCount: 'Всего',
      chooseHint: 'Выберите файл или URL (файл в приоритете)',
    },
    projects: {
      addTitle: 'Новый проект',
      editTitle: 'Редактирование проекта',
      listTitle: 'Список проектов',
      galleryTitle: 'Галерея проекта',
      galleryLayout: 'Лайаут галереи',
      galleryAuto: 'Auto',
      galleryLandscape: 'Широкий',
      galleryPortrait: 'Портрет',
      galleryLivePreview: 'Live preview галереи',
      moveUp: 'Вверх',
      moveDown: 'Вниз',
      updateGallery: 'Обновить галерею',
      title: 'Название',
      subtitle: 'Подзаголовок',
      location: 'Локация',
      style: 'Стиль',
      image: 'Главное изображение',
      gridSize: 'Размер сетки',
      gridAuto: 'Auto (умный)',
      gridNormal: 'Обычный',
      gridWide: 'Широкий',
      gridTall: 'Высокий',
      livePreview: 'Live preview',
      description: 'Описание',
      addGallery: 'Добавить изображение в галерею',
      noGallery: 'У этого проекта пока нет изображений в галерее.',
    },
    gallery: {
      addTitle: 'Добавить изображение галереи',
      listTitle: 'Список галереи',
      imageUrl: 'URL изображения',
    },
    team: {
      addTitle: 'Добавить участника',
      listTitle: 'Список команды',
      name: 'Имя',
      role: 'Роль',
      photo: 'Фото',
    },
    partners: {
      addTitle: 'Добавить партнера',
      listTitle: 'Список партнеров',
      name: 'Название партнера',
      url: 'Ссылка (необязательно)',
    },
    info: {
      addTitle: 'Добавить контактный элемент',
      editTitle: 'Редактирование контактного элемента',
      listTitle: 'Контакты и ссылки',
      key: 'Ключ (unique)',
      title: 'Заголовок',
      value: 'Значение',
      type: 'Тип',
      emoji: 'Emoji (резерв)',
      url: 'URL',
      presets: 'Быстрые шаблоны приложений',
      presetHint: 'Выберите приложение, чтобы автозаполнить key, title и базовый URL',
      iconPreview: 'Предпросмотр иконки',
      typeText: 'Текст',
      typeEmail: 'Email',
      typePhone: 'Телефон',
      typeSocial: 'Соцссылка',
      typeUrl: 'Ссылка',
    },
    placeholders: {
      projectTitle: 'Например, APEX Tower',
      projectSubtitle: 'Например, Exterior',
      projectLocation: 'Например, Dubai, UAE',
      projectStyle: 'Например, Modern',
      projectDescription: 'Короткое описание проекта...',
      projectPreviewSubtitle: 'Подзаголовок на карточке',
      url: 'https://...',
      teamName: 'Полное имя',
      teamRole: 'Например, Principal Architect',
      partnerName: 'Название бренда',
      partnerUrl: 'https://example.com',
      infoKey: 'Например, email, phone, instagram',
      infoTitle: 'Например, Email',
      infoValue: 'Например, hello@example.com',
    },
    confirms: {
      deleteProject: 'Удалить этот проект?',
      deleteProjectGallery: 'Удалить это изображение галереи?',
      deleteGallery: 'Удалить это изображение?',
      deleteTeam: 'Удалить этого участника?',
      deletePartner: 'Удалить этого партнера?',
      deleteInfo: 'Удалить этот контактный элемент?',
    },
    messages: {
      loadFail: 'Ошибка загрузки данных',
      titleRequired: 'Название проекта обязательно',
      projectImageRequired: 'Изображение проекта (файл или URL) обязательно',
      projectAdded: 'Проект успешно добавлен',
      projectUpdated: 'Проект успешно обновлен',
      projectSaveFail: 'Не удалось сохранить проект',
      projectDeleted: 'Проект удален',
      projectDeleteFail: 'Ошибка удаления проекта',
      noProjectSelected: 'Проект не выбран',
      projectGalleryImageRequired: 'Изображение галереи (файл или URL) обязательно',
      projectGalleryAdded: 'Изображение добавлено в галерею',
      projectGalleryAddFail: 'Не удалось добавить изображение в галерею',
      projectGalleryDeleted: 'Изображение галереи удалено',
      projectGalleryDeleteFail: 'Ошибка удаления изображения галереи',
      projectGalleryLayoutSaved: 'Лайаут галереи сохранен',
      projectGalleryLayoutSaveFail: 'Ошибка сохранения лайаута галереи',
      projectGalleryOrderSaved: 'Порядок галереи сохранен',
      projectGalleryOrderSaveFail: 'Ошибка сохранения порядка галереи',
      galleryUrlRequired: 'URL изображения обязателен',
      galleryAdded: 'Изображение добавлено',
      galleryDeleted: 'Изображение удалено',
      galleryDeleteFail: 'Ошибка удаления изображения',
      teamRequired: 'Имя и роль обязательны',
      teamAdded: 'Участник добавлен',
      teamDeleted: 'Участник удален',
      teamDeleteFail: 'Ошибка удаления участника',
      partnerRequired: 'Название партнера обязательно',
      partnerAdded: 'Партнер добавлен',
      partnerDeleted: 'Партнер удален',
      partnerDeleteFail: 'Ошибка удаления партнера',
      infoRequired: 'Key и title обязательны',
      infoAdded: 'Контактный элемент добавлен',
      infoUpdated: 'Контактный элемент обновлен',
      infoDeleted: 'Контактный элемент удален',
      infoDeleteFail: 'Ошибка удаления контактного элемента',
      sessionExpired: 'Сессия истекла. Войдите снова.',
      genericError: 'Произошла ошибка',
    },
  },
};

const TAB_META = {
  projects: { icon: 'P', accent: '#1f7a8c' },
  gallery: { icon: 'G', accent: '#2f6690' },
  team: { icon: 'T', accent: '#40798c' },
  partners: { icon: 'B', accent: '#4d908e' },
  info: { icon: 'I', accent: '#577590' },
};

const SOCIAL_PRESETS = [
  { key: 'telegram', title: 'Telegram', emoji: 'T', url: 'https://t.me/' },
  { key: 'instagram', title: 'Instagram', emoji: 'I', url: 'https://instagram.com/' },
  { key: 'x', title: 'X', emoji: 'X', url: 'https://x.com/' },
  { key: 'facebook', title: 'Facebook', emoji: 'F', url: 'https://facebook.com/' },
  { key: 'linkedin', title: 'LinkedIn', emoji: 'L', url: 'https://linkedin.com/company/' },
  { key: 'youtube', title: 'YouTube', emoji: 'Y', url: 'https://youtube.com/@' },
];

export default function AdminPanel({ token, onLogout, onSessionExpired = onLogout, lang = 'uz', setLang = () => {} }) {
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      showMessage(
        (ADMIN_I18N[lang] || ADMIN_I18N.uz).messages.sessionExpired,
        'error'
      );
      onSessionExpired();
    }

    return res;
  };

  const t = ADMIN_I18N[lang] || ADMIN_I18N.uz;

  const [tab, setTab] = useState('projects');
  const [search, setSearch] = useState('');

  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [team, setTeam] = useState([]);
  const [partners, setPartners] = useState([]);
  const [info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingInfoId, setEditingInfoId] = useState(null);
  const [projectGallery, setProjectGallery] = useState([]);

  const projectImageFileRef = useRef(null);
  const projectGalleryFileRef = useRef(null);
  const teamImageFileRef = useRef(null);

  const [projectForm, setProjectForm] = useState({ title: '', subtitle: '', location: '', style: '', img: '', grid_size: 'auto', description: '' });
  const [projectGalleryForm, setProjectGalleryForm] = useState({ url: '', layout: 'auto' });
  const [galleryForm, setGalleryForm] = useState({ url: '' });
  const [teamForm, setTeamForm] = useState({ name: '', role: '', img: '' });
  const [partnerForm, setPartnerForm] = useState({ name: '', url: '' });
  const [infoForm, setInfoForm] = useState({ key: '', title: '', value: '', type: 'text', emoji: '', url: '' });

  useEffect(() => {
    loadAllData();
  }, []);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    window.clearTimeout(showMessage._timer);
    showMessage._timer = window.setTimeout(() => setMessage({ text: '', type: 'success' }), 2800);
  };

  const readErrorMessage = async (res, fallback) => {
    try {
      const data = await res.json();
      return data?.error || fallback;
    } catch {
      return fallback;
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [pRes, gRes, tRes, paRes, iRes] = await Promise.all([
        fetch(`${API_BASE}/projects`),
        fetch(`${API_BASE}/gallery`),
        fetch(`${API_BASE}/team`),
        fetch(`${API_BASE}/partners`),
        fetch(`${API_BASE}/info`),
      ]);

      if (pRes.ok) setProjects(await pRes.json());
      if (gRes.ok) {
        const gData = await gRes.json();
        setGallery(Array.isArray(gData) ? gData : []);
      }
      if (tRes.ok) setTeam(await tRes.json());
      if (paRes.ok) {
        const pData = await paRes.json();
        setPartners(Array.isArray(pData) ? pData : []);
      }
      if (iRes.ok) setInfo(await iRes.json());
    } catch (err) {
      showMessage(t.messages.loadFail, 'error');
      console.error(err);
    }
    setLoading(false);
  };

  const loadProjectGallery = async (projectId) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/gallery`);
      if (res.ok) {
        const data = await res.json();
        setProjectGallery(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load project gallery:', err);
      setProjectGallery([]);
    }
  };

  const startEditProject = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({ ...project, grid_size: project.grid_size || 'auto' });
    loadProjectGallery(project.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditProject = () => {
    setEditingProjectId(null);
    setProjectForm({ title: '', subtitle: '', location: '', style: '', img: '', grid_size: 'auto', description: '' });
    setProjectGallery([]);
    setProjectGalleryForm({ url: '', layout: 'auto' });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title) {
      showMessage(t.messages.titleRequired, 'error');
      return;
    }

    const file = projectImageFileRef.current?.files?.[0];
    if (!file && !projectForm.img) {
      showMessage(t.messages.projectImageRequired, 'error');
      return;
    }

    const method = editingProjectId ? 'PUT' : 'POST';
    const url = editingProjectId ? `${API_BASE}/projects/${editingProjectId}` : `${API_BASE}/projects`;

    try {
      let body;
      let headers = {};

      if (file) {
        body = new FormData();
        body.append('title', projectForm.title);
        body.append('subtitle', projectForm.subtitle);
        body.append('location', projectForm.location);
        body.append('style', projectForm.style);
        body.append('grid_size', projectForm.grid_size || 'auto');
        body.append('description', projectForm.description);
        body.append('img', file);
      } else {
        body = JSON.stringify(projectForm);
        headers['Content-Type'] = 'application/json';
      }

      const res = await authFetch(url, {
        method,
        headers,
        body,
      });

      if (res.ok) {
        setProjectForm({ title: '', subtitle: '', location: '', style: '', img: '', grid_size: 'auto', description: '' });
        if (projectImageFileRef.current) projectImageFileRef.current.value = '';
        setEditingProjectId(null);
        loadAllData();
        showMessage(editingProjectId ? t.messages.projectUpdated : t.messages.projectAdded, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.projectSaveFail);
        showMessage(errMsg, 'error');
      }
    } catch (err) {
      showMessage(`${t.messages.genericError}: ${err.message}`, 'error');
    }
  };

  const handleAddProjectGallery = async (e) => {
    e.preventDefault();
    if (!editingProjectId) {
      showMessage(t.messages.noProjectSelected, 'error');
      return;
    }

    const file = projectGalleryFileRef.current?.files?.[0];
    if (!file && !projectGalleryForm.url) {
      showMessage(t.messages.projectGalleryImageRequired, 'error');
      return;
    }

    try {
      let body;
      let headers = {};

      if (file) {
        body = new FormData();
        body.append('img', file);
        body.append('layout', projectGalleryForm.layout || 'auto');
      } else {
        body = JSON.stringify({ url: projectGalleryForm.url, layout: projectGalleryForm.layout || 'auto' });
        headers['Content-Type'] = 'application/json';
      }

      const res = await authFetch(`${API_BASE}/projects/${editingProjectId}/gallery`, {
        method: 'POST',
        headers,
        body,
      });

      if (res.ok) {
        setProjectGalleryForm({ url: '', layout: 'auto' });
        if (projectGalleryFileRef.current) projectGalleryFileRef.current.value = '';
        loadProjectGallery(editingProjectId);
        showMessage(t.messages.projectGalleryAdded, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.projectGalleryAddFail);
        showMessage(errMsg, 'error');
      }
    } catch (err) {
      showMessage(`${t.messages.genericError}: ${err.message}`, 'error');
    }
  };

  const deleteProjectGallery = async (galleryId) => {
    if (!window.confirm(t.confirms.deleteProjectGallery)) return;
    try {
      const res = await authFetch(`${API_BASE}/gallery/${galleryId}`, { method: 'DELETE' });
      if (res.ok) {
        if (editingProjectId) loadProjectGallery(editingProjectId);
        showMessage(t.messages.projectGalleryDeleted, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.projectGalleryDeleteFail);
        showMessage(errMsg, 'error');
      }
    } catch {
      showMessage(t.messages.projectGalleryDeleteFail, 'error');
    }
  };

  const updateProjectGalleryLayout = (galleryId, layout) => {
    setProjectGallery((prev) => prev.map((item) => (item.id === galleryId ? { ...item, layout } : item)));
  };

  const saveProjectGalleryChanges = async () => {
    if (!editingProjectId || !projectGallery.length) return;

    try {
      const orderRes = await authFetch(`${API_BASE}/projects/${editingProjectId}/gallery/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ galleryIds: projectGallery.map((item) => item.id) }),
      });

      if (!orderRes.ok) {
        const errMsg = await readErrorMessage(orderRes, t.messages.projectGalleryOrderSaveFail);
        showMessage(errMsg, 'error');
        return;
      }

      const layoutResults = await Promise.all(
        projectGallery.map((item) =>
          authFetch(`${API_BASE}/gallery/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ layout: item.layout || 'auto' }),
          })
        )
      );

      if (layoutResults.some((res) => !res.ok)) {
        const failedRes = layoutResults.find((res) => !res.ok);
        const errMsg = await readErrorMessage(failedRes, t.messages.projectGalleryLayoutSaveFail);
        showMessage(errMsg, 'error');
        return;
      }

      showMessage(t.messages.projectGalleryOrderSaved, 'success');
      loadProjectGallery(editingProjectId);
    } catch {
      showMessage(t.messages.projectGalleryOrderSaveFail, 'error');
    }
  };

  const moveProjectGallery = (galleryId, direction) => {
    const index = projectGallery.findIndex((item) => item.id === galleryId);
    if (index < 0) return;

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= projectGallery.length) return;

    const next = [...projectGallery];
    const tmp = next[index];
    next[index] = next[nextIndex];
    next[nextIndex] = tmp;
    setProjectGallery(next);
  };

  const deleteProject = async (id) => {
    if (!window.confirm(t.confirms.deleteProject)) return;
    try {
      const res = await authFetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
        showMessage(t.messages.projectDeleted, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.projectDeleteFail);
        showMessage(errMsg, 'error');
      }
    } catch {
      showMessage(t.messages.projectDeleteFail, 'error');
    }
  };

  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryForm.url) {
      showMessage(t.messages.galleryUrlRequired, 'error');
      return;
    }

    try {
      const res = await authFetch(`${API_BASE}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(galleryForm),
      });
      if (res.ok) {
        setGalleryForm({ url: '' });
        loadAllData();
        showMessage(t.messages.galleryAdded, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.genericError);
        showMessage(errMsg, 'error');
      }
    } catch (err) {
      showMessage(`${t.messages.genericError}: ${err.message}`, 'error');
    }
  };

  const deleteGallery = async (id) => {
    if (!window.confirm(t.confirms.deleteGallery)) return;
    try {
      const res = await authFetch(`${API_BASE}/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
        showMessage(t.messages.galleryDeleted, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.galleryDeleteFail);
        showMessage(errMsg, 'error');
      }
    } catch {
      showMessage(t.messages.galleryDeleteFail, 'error');
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role) {
      showMessage(t.messages.teamRequired, 'error');
      return;
    }

    const file = teamImageFileRef.current?.files?.[0];

    try {
      let body;
      let headers = {};

      if (file) {
        body = new FormData();
        body.append('name', teamForm.name);
        body.append('role', teamForm.role);
        body.append('img', file);
      } else {
        body = JSON.stringify(teamForm);
        headers['Content-Type'] = 'application/json';
      }

      const res = await authFetch(`${API_BASE}/team`, {
        method: 'POST',
        headers,
        body,
      });

      if (res.ok) {
        setTeamForm({ name: '', role: '', img: '' });
        if (teamImageFileRef.current) teamImageFileRef.current.value = '';
        loadAllData();
        showMessage(t.messages.teamAdded, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.genericError);
        showMessage(errMsg, 'error');
      }
    } catch (err) {
      showMessage(`${t.messages.genericError}: ${err.message}`, 'error');
    }
  };

  const deleteTeam = async (id) => {
    if (!window.confirm(t.confirms.deleteTeam)) return;
    try {
      const res = await authFetch(`${API_BASE}/team/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
        showMessage(t.messages.teamDeleted, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.teamDeleteFail);
        showMessage(errMsg, 'error');
      }
    } catch {
      showMessage(t.messages.teamDeleteFail, 'error');
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    if (!partnerForm.name) {
      showMessage(t.messages.partnerRequired, 'error');
      return;
    }

    try {
      const res = await authFetch(`${API_BASE}/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerForm),
      });

      if (res.ok) {
        setPartnerForm({ name: '', url: '' });
        loadAllData();
        showMessage(t.messages.partnerAdded, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.genericError);
        showMessage(errMsg, 'error');
      }
    } catch (err) {
      showMessage(`${t.messages.genericError}: ${err.message}`, 'error');
    }
  };

  const deletePartner = async (id) => {
    if (!window.confirm(t.confirms.deletePartner)) return;
    try {
      const res = await authFetch(`${API_BASE}/partners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
        showMessage(t.messages.partnerDeleted, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.partnerDeleteFail);
        showMessage(errMsg, 'error');
      }
    } catch {
      showMessage(t.messages.partnerDeleteFail, 'error');
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!infoForm.key || !infoForm.title) {
      showMessage(t.messages.infoRequired, 'error');
      return;
    }

    const method = editingInfoId ? 'PUT' : 'POST';
    const url = editingInfoId ? `${API_BASE}/info/${editingInfoId}` : `${API_BASE}/info`;

    try {
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infoForm),
      });
      if (res.ok) {
        setInfoForm({ key: '', title: '', value: '', type: 'text', emoji: '', url: '' });
        setEditingInfoId(null);
        loadAllData();
        showMessage(editingInfoId ? t.messages.infoUpdated : t.messages.infoAdded, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.projectSaveFail);
        showMessage(errMsg, 'error');
      }
    } catch (err) {
      showMessage(`${t.messages.genericError}: ${err.message}`, 'error');
    }
  };

  const startEditInfo = (item) => {
    setEditingInfoId(item.id);
    setInfoForm(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditInfo = () => {
    setEditingInfoId(null);
    setInfoForm({ key: '', title: '', value: '', type: 'text', emoji: '', url: '' });
  };

  const deleteInfo = async (id) => {
    if (!window.confirm(t.confirms.deleteInfo)) return;
    try {
      const res = await authFetch(`${API_BASE}/info/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAllData();
        showMessage(t.messages.infoDeleted, 'success');
      } else {
        const errMsg = await readErrorMessage(res, t.messages.infoDeleteFail);
        showMessage(errMsg, 'error');
      }
    } catch {
      showMessage(t.messages.infoDeleteFail, 'error');
    }
  };

  const applySocialPreset = (preset) => {
    setInfoForm((prev) => ({
      ...prev,
      key: preset.key,
      title: preset.title,
      type: 'social',
      emoji: preset.emoji,
      url: prev.url || preset.url,
    }));
  };

  const normalizeText = (value = '') => String(value).toLowerCase();

  const resolveSocialPlatform = (item) => {
    const key = normalizeText(item.key);
    const title = normalizeText(item.title);
    const url = normalizeText(item.url);
    const combined = `${key} ${title} ${url}`;

    if (combined.includes('instagram')) return 'instagram';
    if (combined.includes('telegram') || combined.includes('t.me')) return 'telegram';
    if (combined.includes('x.com') || combined.includes('twitter') || key === 'x') return 'x';
    if (combined.includes('facebook') || combined.includes('fb.com')) return 'facebook';
    if (combined.includes('linkedin')) return 'linkedin';
    if (combined.includes('youtube') || combined.includes('youtu.be')) return 'youtube';
    return null;
  };

  const renderSocialIcon = (item) => {
    const platform = resolveSocialPlatform(item);
    if (platform === 'instagram') return <SiInstagram size={16} />;
    if (platform === 'telegram') return <SiTelegram size={16} />;
    if (platform === 'x') return <SiX size={16} />;
    if (platform === 'facebook') return <SiFacebook size={16} />;
    if (platform === 'linkedin') return <BiLogoLinkedin size={17} />;
    if (platform === 'youtube') return <SiYoutube size={16} />;
    return <span>{item.emoji || '•'}</span>;
  };

  const getSocialUrlPlaceholder = (item) => {
    const platform = resolveSocialPlatform(item);
    if (platform === 'instagram') return 'https://instagram.com/yourhandle';
    if (platform === 'telegram') return 'https://t.me/yourhandle';
    if (platform === 'x') return 'https://x.com/yourhandle';
    if (platform === 'facebook') return 'https://facebook.com/yourpage';
    if (platform === 'linkedin') return 'https://linkedin.com/company/yourbrand';
    if (platform === 'youtube') return 'https://youtube.com/@yourchannel';
    return t.placeholders.url;
  };

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter((p) => `${p.title} ${p.location} ${p.style} ${p.grid_size || ''}`.toLowerCase().includes(q));
  }, [projects, search]);

  const filteredGallery = useMemo(() => {
    if (!search) return gallery;
    const q = search.toLowerCase();
    return gallery.filter((g) => String(g.url || g).toLowerCase().includes(q));
  }, [gallery, search]);

  const filteredTeam = useMemo(() => {
    if (!search) return team;
    const q = search.toLowerCase();
    return team.filter((m) => `${m.name} ${m.role}`.toLowerCase().includes(q));
  }, [team, search]);

  const filteredPartners = useMemo(() => {
    if (!search) return partners;
    const q = search.toLowerCase();
    return partners.filter((p) => `${p.name || ''} ${p.url || ''}`.toLowerCase().includes(q));
  }, [partners, search]);

  const filteredInfo = useMemo(() => {
    if (!search) return info;
    const q = search.toLowerCase();
    return info.filter((item) => `${item.key} ${item.title} ${item.value} ${item.type} ${item.url}`.toLowerCase().includes(q));
  }, [info, search]);

  const css = `
    * { margin: 0; padding: 0; box-sizing: border-box; }

    .admin-wrapper {
      min-height: 100vh;
      padding: 24px;
      background:
        radial-gradient(1200px 420px at 0% 0%, rgba(60, 126, 162, 0.18), transparent 55%),
        radial-gradient(900px 420px at 100% 0%, rgba(76, 161, 175, 0.14), transparent 58%),
        linear-gradient(180deg, #f4f8fb 0%, #eef3f6 100%);
      color: #0f172a;
      font-family: 'Jost', system-ui, sans-serif;
    }

    .admin-container {
      max-width: 1440px;
      margin: 0 auto;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      margin-bottom: 18px;
    }

    .title-wrap h1 {
      font-size: clamp(28px, 3vw, 40px);
      font-weight: 650;
      letter-spacing: 0.01em;
      line-height: 1;
    }

    .title-wrap p {
      margin-top: 8px;
      font-size: 14px;
      color: #5b6b7a;
    }

    .admin-status {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-chip {
      border: 1px solid #bee3ce;
      background: #f2fff7;
      color: #1f6f4a;
      border-radius: 999px;
      padding: 9px 14px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .top-actions {
      display: inline-flex;
      align-items: center;
      background: #fff;
      border: 1px solid #d9e3eb;
      border-radius: 14px;
      padding: 6px;
      gap: 6px;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
    }

    .top-label {
      font-size: 11px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #6f8090;
      padding: 0 6px;
      font-weight: 600;
    }

    .admin-lang-btn {
      border: 1px solid #d6e0e8;
      background: #f7fbff;
      color: #24435b;
      padding: 7px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      transition: all 0.2s;
    }

    .admin-lang-btn.on {
      background: #204b6b;
      color: #fff;
      border-color: #204b6b;
    }

    .btn-logout {
      border: 1px solid #ecc9cf;
      color: #9b2436;
      background: #fff6f8;
      padding: 7px 12px;
      border-radius: 10px;
      cursor: pointer;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-logout:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 14px rgba(155, 36, 54, 0.15);
    }

    .admin-stats {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 12px;
      margin: 16px 0 18px;
    }

    .stat-card {
      border-radius: 14px;
      padding: 14px 16px;
      border: 1px solid #d9e3eb;
      background: #fff;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    }

    .stat-num {
      font-size: 25px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #173449;
      line-height: 1;
    }

    .stat-label {
      margin-top: 8px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #678196;
      font-weight: 600;
    }

    .admin-tabs {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 12px;
    }

    .admin-tab-btn {
      border: 1px solid #d9e3eb;
      border-radius: 12px;
      background: #fff;
      padding: 12px 10px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.02em;
      cursor: pointer;
      color: #1f3446;
      transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    }

    .tab-dot {
      width: 22px;
      height: 22px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: #fff;
      font-weight: 700;
    }

    .admin-tab-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(31, 66, 92, 0.13);
      border-color: #bdd1df;
    }

    .admin-tab-btn.active {
      border-color: #245273;
      background: linear-gradient(135deg, #204b6b 0%, #2a607f 100%);
      color: #fff;
    }

    .workflow-hint {
      border: 1px solid #cde0ec;
      border-radius: 12px;
      background: #f4fbff;
      color: #1f4f6e;
      padding: 12px 14px;
      margin-bottom: 14px;
      font-size: 13px;
      line-height: 1.45;
    }

    .search-row {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
      border: 1px solid #d5e1eb;
      background: #fff;
      border-radius: 12px;
      padding: 10px 12px;
    }

    .search-row label {
      font-size: 11px;
      color: #5f7386;
      letter-spacing: 0.08em;
      font-weight: 700;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .search-row input {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      font-size: 14px;
      color: #1e2d3a;
    }

    .admin-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 40px;
    }

    .admin-card {
      border: 1px solid #d7e2eb;
      border-radius: 16px;
      padding: 18px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(2px);
      box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
    }

    .admin-card.edit-mode {
      border-color: #f1cb81;
      background: linear-gradient(180deg, #fffdf7 0%, #fff8e8 100%);
    }

    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 14px;
    }

    .card-title h3 {
      font-size: 17px;
      font-weight: 700;
      color: #173449;
    }

    .count-pill {
      font-size: 11px;
      color: #567189;
      background: #edf4f9;
      border: 1px solid #d8e7f2;
      border-radius: 999px;
      padding: 4px 9px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }

    .form-group {
      margin-bottom: 13px;
    }

    .form-group label {
      display: block;
      margin-bottom: 7px;
      font-size: 11px;
      color: #4c6376;
      font-weight: 700;
      letter-spacing: 0.07em;
      text-transform: uppercase;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      border: 1px solid #d5e1eb;
      border-radius: 10px;
      background: #fff;
      padding: 11px 12px;
      font-size: 14px;
      color: #1d3344;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      border-color: #2b607f;
      box-shadow: 0 0 0 3px rgba(43, 96, 127, 0.12);
    }

    .form-group textarea {
      min-height: 90px;
      resize: vertical;
    }

    .file-url-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 8px;
    }

    .file-url-row input[type='file'] {
      border-style: dashed;
      background: #f8fbfd;
      padding: 9px;
      cursor: pointer;
    }

    .muted-note {
      font-size: 12px;
      color: #688095;
      line-height: 1.35;
    }

    .layout-picker {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }

    .layout-btn {
      border: 1px solid #ceddea;
      background: #f8fbff;
      color: #244c69;
      border-radius: 10px;
      padding: 9px 10px;
      text-align: left;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .layout-btn.active,
    .layout-btn:hover {
      border-color: #2c6383;
      background: #eaf4fb;
    }

    .layout-preview-shell {
      border: 1px solid #d8e6f0;
      border-radius: 14px;
      background: #f2f8fc;
      padding: 12px;
    }

    .layout-preview-grid {
      display: grid;
      grid-template-columns: repeat(12, minmax(0, 1fr));
      gap: 8px;
      min-height: 120px;
    }

    .layout-preview-card {
      position: relative;
      grid-column: span 6;
      height: 108px;
      border-radius: 10px;
      overflow: hidden;
      background: #d7e5f0;
      border: 1px solid #b8cfdf;
    }

    .layout-preview-card.size-wide {
      grid-column: span 8;
      height: 112px;
    }

    .layout-preview-card.size-tall {
      grid-column: span 4;
      height: 138px;
    }

    .layout-preview-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.74);
    }

    .layout-preview-overlay {
      position: absolute;
      inset: 0;
      padding: 10px;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background: linear-gradient(to top, rgba(0,0,0,0.42), rgba(0,0,0,0.08));
    }

    .layout-preview-title {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.02em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .layout-preview-subtitle {
      margin-top: 2px;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      opacity: 0.85;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .gallery-layout-controls {
      display: inline-flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .gallery-layout-btn {
      border: 1px solid #cfdeea;
      border-radius: 8px;
      background: #f8fbff;
      color: #244963;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 8px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .gallery-layout-btn.active {
      border-color: #2f6484;
      background: #e9f4fb;
    }

    .gallery-live-grid {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 8px;
      margin-top: 10px;
    }

    .gallery-live-item {
      position: relative;
      overflow: hidden;
      border-radius: 10px;
      border: 1px solid #cde0ee;
      background: #deebf4;
      min-height: 90px;
      grid-column: span 3;
      aspect-ratio: 3 / 4;
    }

    .gallery-live-item.landscape {
      grid-column: span 6;
      aspect-ratio: 16 / 8;
    }

    .gallery-live-item.portrait {
      grid-column: span 3;
      aspect-ratio: 3 / 4;
    }

    .gallery-live-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: brightness(0.85);
    }

    .gallery-live-item-tag {
      position: absolute;
      left: 8px;
      bottom: 8px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 700;
      color: #fff;
      background: rgba(7, 18, 29, 0.58);
      border: 1px solid rgba(255,255,255,0.28);
      padding: 4px 6px;
      border-radius: 6px;
    }

    .preset-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .preset-btn {
      border: 1px solid #ceddea;
      border-radius: 999px;
      background: #fff;
      color: #224560;
      font-size: 12px;
      font-weight: 700;
      padding: 7px 12px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .preset-btn.active,
    .preset-btn:hover {
      border-color: #2c6383;
      background: #edf6fc;
    }

    .icon-preview {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: 1px solid #d2e0eb;
      border-radius: 8px;
      background: #fff;
      color: #173a52;
      margin-left: 8px;
    }

    .form-actions {
      display: flex;
      gap: 8px;
      margin-top: 6px;
    }

    .btn-main,
    .btn-secondary,
    .btn-edit,
    .btn-delete {
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-main {
      background: linear-gradient(135deg, #204b6b 0%, #2b6789 100%);
      color: #fff;
      padding: 11px 14px;
      width: 100%;
    }

    .btn-main:hover,
    .btn-secondary:hover,
    .btn-edit:hover,
    .btn-delete:hover {
      transform: translateY(-1px);
    }

    .btn-secondary {
      background: #f1f6fa;
      border: 1px solid #d4e2ec;
      color: #1f425d;
      padding: 11px 14px;
      width: 100%;
    }

    .btn-edit {
      background: #ecf5fb;
      color: #205170;
      border: 1px solid #cfe0ea;
      padding: 8px 10px;
    }

    .btn-delete {
      background: #fff3f5;
      color: #9b2436;
      border: 1px solid #f1d2d8;
      padding: 8px 10px;
    }

    .list {
      display: grid;
      gap: 10px;
    }

    .list-item {
      border: 1px solid #dce7ef;
      border-radius: 12px;
      background: #fbfdff;
      padding: 11px;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: space-between;
    }

    .list-main {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
      flex: 1;
    }

    .list-thumb {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #dce7ef;
      background: #eef5fb;
      flex: 0 0 auto;
    }

    .list-text {
      min-width: 0;
      flex: 1;
    }

    .list-title {
      font-size: 14px;
      font-weight: 700;
      color: #15364d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .list-meta {
      margin-top: 3px;
      font-size: 12px;
      color: #698298;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .list-actions {
      display: inline-flex;
      gap: 6px;
      flex-shrink: 0;
    }

    .empty-state {
      border: 1px dashed #cfdde8;
      border-radius: 12px;
      background: #f7fbff;
      padding: 18px;
      font-size: 13px;
      color: #60798e;
      text-align: center;
    }

    .message {
      position: fixed;
      right: 20px;
      top: 20px;
      z-index: 40;
      border-radius: 11px;
      border: 1px solid #cae4d5;
      background: #f3fff9;
      color: #1f6f4a;
      padding: 12px 14px;
      font-size: 13px;
      font-weight: 600;
      box-shadow: 0 10px 16px rgba(22, 75, 47, 0.12);
      animation: slideIn .25s ease;
    }

    .message.error {
      border-color: #f0ced4;
      background: #fff4f6;
      color: #9b2436;
      box-shadow: 0 10px 16px rgba(130, 36, 57, 0.15);
    }

    .loading {
      text-align: center;
      padding: 44px;
      color: #597489;
      font-size: 14px;
      font-weight: 600;
    }

    @keyframes slideIn {
      from { transform: translateY(-8px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    @media (max-width: 1100px) {
      .admin-content { grid-template-columns: 1fr; }
      .admin-tabs { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .admin-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }

    @media (max-width: 760px) {
      .admin-wrapper { padding: 14px; }
      .admin-header { flex-direction: column; align-items: stretch; }
      .admin-status { justify-content: space-between; }
      .top-actions { width: 100%; justify-content: flex-end; }
      .admin-tabs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .file-url-row { grid-template-columns: 1fr; }
      .list-item { flex-direction: column; align-items: stretch; }
      .list-actions { width: 100%; }
      .btn-edit, .btn-delete { width: 100%; }
    }

    @media (max-width: 520px) {
      .admin-tabs { grid-template-columns: 1fr; }
      .admin-stats { grid-template-columns: 1fr; }
      .search-row { flex-direction: column; align-items: stretch; }
    }
  `;

  if (loading) {
    return (
      <>
        <style>{css}</style>
        <div className="admin-wrapper">
          <div className="admin-container">
            <div className="loading">{t.loading}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="admin-wrapper">
        <div className="admin-container">
          <div className="admin-header">
            <div className="title-wrap">
              <h1>{t.dashboard}</h1>
              <p>{t.subtitle}</p>
            </div>
            <div className="admin-status">
              <div className="status-chip">{t.connected}</div>
              <div className="top-actions">
                <span className="top-label">{t.language}</span>
                <button className={`admin-lang-btn ${lang === 'uz' ? 'on' : ''}`} onClick={() => setLang('uz')} type="button">UZ</button>
                <button className={`admin-lang-btn ${lang === 'ru' ? 'on' : ''}`} onClick={() => setLang('ru')} type="button">RU</button>
                <button type="button" className="btn-logout" onClick={onLogout}>{t.logout}</button>
              </div>
            </div>
          </div>

          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-num">{projects.length}</div>
              <div className="stat-label">{t.stats.projects}</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{gallery.length}</div>
              <div className="stat-label">{t.stats.images}</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{team.length}</div>
              <div className="stat-label">{t.stats.team}</div>
            </div>
            <div className="stat-card">
              <div className="stat-num">{info.length}</div>
              <div className="stat-label">{t.stats.links}</div>
            </div>
          </div>

          {message.text && <div className={`message ${message.type === 'error' ? 'error' : ''}`}>{message.text}</div>}

          <div className="admin-tabs">
            {['projects', 'gallery', 'team', 'partners', 'info'].map((tabKey) => (
              <button
                key={tabKey}
                className={`admin-tab-btn ${tab === tabKey ? 'active' : ''}`}
                onClick={() => setTab(tabKey)}
              >
                <span className="tab-dot" style={{ background: TAB_META[tabKey].accent }}>{TAB_META[tabKey].icon}</span>
                {t.tabs[tabKey]}
              </button>
            ))}
          </div>

          <div className="workflow-hint">{t.tabHints[tab]}</div>

          <div className="search-row">
            <label>{t.search}</label>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.searchPlaceholder} />
          </div>

          <div className="admin-content">
            {tab === 'projects' && (
              <>
                <div className={`admin-card ${editingProjectId ? 'edit-mode' : ''}`}>
                  <div className="card-title">
                    <h3>{editingProjectId ? t.projects.editTitle : t.projects.addTitle}</h3>
                  </div>
                  <form onSubmit={handleAddProject}>
                    <div className="form-group">
                      <label>{t.projects.title} ({t.common.required})</label>
                      <input type="text" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder={t.placeholders.projectTitle} required />
                    </div>
                    <div className="form-group">
                      <label>{t.projects.subtitle}</label>
                      <input type="text" value={projectForm.subtitle} onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })} placeholder={t.placeholders.projectSubtitle} />
                    </div>
                    <div className="form-group">
                      <label>{t.projects.location}</label>
                      <input type="text" value={projectForm.location} onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })} placeholder={t.placeholders.projectLocation} />
                    </div>
                    <div className="form-group">
                      <label>{t.projects.style}</label>
                      <input type="text" value={projectForm.style} onChange={(e) => setProjectForm({ ...projectForm, style: e.target.value })} placeholder={t.placeholders.projectStyle} />
                    </div>
                    <div className="form-group">
                      <label>{t.projects.image}</label>
                      <div className="file-url-row">
                        <input type="file" ref={projectImageFileRef} accept="image/*" />
                        <input type="url" value={projectForm.img} onChange={(e) => setProjectForm({ ...projectForm, img: e.target.value })} placeholder={t.placeholders.url} />
                      </div>
                      <div className="muted-note">{t.common.chooseHint}</div>
                    </div>
                    <div className="form-group">
                      <label>{t.projects.gridSize}</label>
                      <div className="layout-picker">
                        {[
                          { key: 'auto', label: t.projects.gridAuto },
                          { key: 'normal', label: t.projects.gridNormal },
                          { key: 'wide', label: t.projects.gridWide },
                          { key: 'tall', label: t.projects.gridTall },
                        ].map((option) => (
                          <button
                            key={option.key}
                            type="button"
                            className={`layout-btn ${(projectForm.grid_size || 'auto') === option.key ? 'active' : ''}`}
                            onClick={() => setProjectForm({ ...projectForm, grid_size: option.key })}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{t.projects.livePreview}</label>
                      <div className="layout-preview-shell">
                        <div className="layout-preview-grid">
                          <div className={`layout-preview-card size-${projectForm.grid_size || 'auto'}`}>
                            {projectForm.img ? (
                              <img src={toImageUrl(projectForm.img)} alt="preview" />
                            ) : null}
                            <div className="layout-preview-overlay">
                              <div className="layout-preview-title">{projectForm.title || t.placeholders.projectTitle}</div>
                              <div className="layout-preview-subtitle">{projectForm.subtitle || t.placeholders.projectPreviewSubtitle}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>{t.projects.description}</label>
                      <textarea value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder={t.placeholders.projectDescription} />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-main">{editingProjectId ? t.common.update : t.common.add}</button>
                      {editingProjectId && <button type="button" className="btn-secondary" onClick={cancelEditProject}>{t.common.cancel}</button>}
                    </div>
                  </form>

                  {editingProjectId && (
                    <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #dde8f0' }}>
                      <div className="card-title">
                        <h3>{t.projects.galleryTitle}</h3>
                        <span className="count-pill">{t.common.listCount}: {projectGallery.length}</span>
                      </div>

                      <form onSubmit={handleAddProjectGallery}>
                        <div className="form-group">
                          <label>{t.projects.addGallery}</label>
                          <div className="file-url-row">
                            <input type="file" ref={projectGalleryFileRef} accept="image/*" />
                            <input type="url" value={projectGalleryForm.url} onChange={(e) => setProjectGalleryForm((prev) => ({ ...prev, url: e.target.value }))} placeholder={t.placeholders.url} />
                          </div>
                          <div className="gallery-layout-controls" style={{ marginBottom: 8 }}>
                            {[
                              { key: 'auto', label: t.projects.galleryAuto },
                              { key: 'landscape', label: t.projects.galleryLandscape },
                              { key: 'portrait', label: t.projects.galleryPortrait },
                            ].map((option) => (
                              <button
                                key={option.key}
                                type="button"
                                className={`gallery-layout-btn ${projectGalleryForm.layout === option.key ? 'active' : ''}`}
                                onClick={() => setProjectGalleryForm((prev) => ({ ...prev, layout: option.key }))}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                          <div className="muted-note">{t.common.chooseHint}</div>
                        </div>
                        <button type="submit" className="btn-main">{t.common.add}</button>
                      </form>

                      <div className="list" style={{ marginTop: 12 }}>
                        {projectGallery.length === 0 ? (
                          <div className="empty-state">{t.projects.noGallery}</div>
                        ) : (
                          projectGallery.map((g, idx) => (
                            <div className="list-item" key={g.id}>
                              <div className="list-main">
                                <img className="list-thumb" src={toImageUrl(g.url)} alt="gallery" />
                                <div className="list-text">
                                  <div className="list-title">{g.id}</div>
                                  <div className="list-meta">{g.url}</div>
                                  <div className="gallery-layout-controls" style={{ marginTop: 6 }}>
                                    {[
                                      { key: 'auto', label: t.projects.galleryAuto },
                                      { key: 'landscape', label: t.projects.galleryLandscape },
                                      { key: 'portrait', label: t.projects.galleryPortrait },
                                    ].map((option) => (
                                      <button
                                        key={option.key}
                                        type="button"
                                        className={`gallery-layout-btn ${(g.layout || 'auto') === option.key ? 'active' : ''}`}
                                        onClick={() => updateProjectGalleryLayout(g.id, option.key)}
                                      >
                                        {option.label}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="list-actions">
                                <button
                                  type="button"
                                  className="btn-edit"
                                  onClick={() => moveProjectGallery(g.id, 'up')}
                                  disabled={idx === 0}
                                  style={{ opacity: idx === 0 ? 0.45 : 1 }}
                                >
                                  {t.projects.moveUp}
                                </button>
                                <button
                                  type="button"
                                  className="btn-edit"
                                  onClick={() => moveProjectGallery(g.id, 'down')}
                                  disabled={idx === projectGallery.length - 1}
                                  style={{ opacity: idx === projectGallery.length - 1 ? 0.45 : 1 }}
                                >
                                  {t.projects.moveDown}
                                </button>
                                <button type="button" className="btn-delete" onClick={() => deleteProjectGallery(g.id)}>{t.common.delete}</button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {projectGallery.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <button type="button" className="btn-main" onClick={saveProjectGalleryChanges}>
                            {t.projects.updateGallery}
                          </button>
                        </div>
                      )}

                      <div style={{ marginTop: 14 }}>
                        <div className="muted-note" style={{ fontWeight: 700 }}>{t.projects.galleryLivePreview}</div>
                        <div className="gallery-live-grid">
                          {projectGallery.slice(0, 8).map((g) => {
                            const layout = g.layout || 'auto';
                            return (
                              <div key={`preview-${g.id}`} className={`gallery-live-item ${layout === 'auto' ? '' : layout}`}>
                                <img src={toImageUrl(g.url)} alt="preview" />
                                <div className="gallery-live-item-tag">{layout}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.projects.listTitle}</h3>
                    <span className="count-pill">{t.common.listCount}: {filteredProjects.length}</span>
                  </div>
                  <div className="list">
                    {filteredProjects.length === 0 ? (
                      <div className="empty-state">{search ? t.noResults : t.common.empty}</div>
                    ) : (
                      filteredProjects.map((p) => (
                        <div className="list-item" key={p.id}>
                          <div className="list-main">
                            <img className="list-thumb" src={toImageUrl(p.img)} alt={p.title} />
                            <div className="list-text">
                              <div className="list-title">{p.title}</div>
                              <div className="list-meta">{p.location || '-'} | {p.style || '-'} | grid: {p.grid_size || 'auto'}</div>
                            </div>
                          </div>
                          <div className="list-actions">
                            <button type="button" className="btn-edit" onClick={() => startEditProject(p)}>{t.common.edit}</button>
                            <button type="button" className="btn-delete" onClick={() => deleteProject(p.id)}>{t.common.delete}</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {tab === 'gallery' && (
              <>
                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.gallery.addTitle}</h3>
                  </div>
                  <form onSubmit={handleAddGallery}>
                    <div className="form-group">
                      <label>{t.gallery.imageUrl} ({t.common.required})</label>
                      <input type="url" value={galleryForm.url} onChange={(e) => setGalleryForm({ url: e.target.value })} placeholder={t.placeholders.url} required />
                    </div>
                    <button type="submit" className="btn-main">{t.common.add}</button>
                  </form>
                </div>

                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.gallery.listTitle}</h3>
                    <span className="count-pill">{t.common.listCount}: {filteredGallery.length}</span>
                  </div>
                  <div className="list">
                    {filteredGallery.length === 0 ? (
                      <div className="empty-state">{search ? t.noResults : t.common.empty}</div>
                    ) : (
                      filteredGallery.map((g) => (
                        <div className="list-item" key={g.id}>
                          <div className="list-main">
                            <img className="list-thumb" src={toImageUrl(g.url || g)} alt="gallery" />
                            <div className="list-text">
                              <div className="list-title">{g.id || '-'}</div>
                              <div className="list-meta">{g.url || g}</div>
                            </div>
                          </div>
                          <div className="list-actions">
                            <button type="button" className="btn-delete" onClick={() => deleteGallery(g.id)}>{t.common.delete}</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {tab === 'team' && (
              <>
                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.team.addTitle}</h3>
                  </div>
                  <form onSubmit={handleAddTeam}>
                    <div className="form-group">
                      <label>{t.team.name} ({t.common.required})</label>
                      <input type="text" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder={t.placeholders.teamName} required />
                    </div>
                    <div className="form-group">
                      <label>{t.team.role} ({t.common.required})</label>
                      <input type="text" value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} placeholder={t.placeholders.teamRole} required />
                    </div>
                    <div className="form-group">
                      <label>{t.team.photo}</label>
                      <div className="file-url-row">
                        <input type="file" ref={teamImageFileRef} accept="image/*" />
                        <input type="url" value={teamForm.img} onChange={(e) => setTeamForm({ ...teamForm, img: e.target.value })} placeholder={t.placeholders.url} />
                      </div>
                      <div className="muted-note">{t.common.chooseHint}</div>
                    </div>
                    <button type="submit" className="btn-main">{t.common.add}</button>
                  </form>
                </div>

                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.team.listTitle}</h3>
                    <span className="count-pill">{t.common.listCount}: {filteredTeam.length}</span>
                  </div>
                  <div className="list">
                    {filteredTeam.length === 0 ? (
                      <div className="empty-state">{search ? t.noResults : t.common.empty}</div>
                    ) : (
                      filteredTeam.map((member) => (
                        <div className="list-item" key={member.id}>
                          <div className="list-main">
                            <img className="list-thumb" src={toImageUrl(member.img)} alt={member.name} />
                            <div className="list-text">
                              <div className="list-title">{member.name}</div>
                              <div className="list-meta">{member.role}</div>
                            </div>
                          </div>
                          <div className="list-actions">
                            <button type="button" className="btn-delete" onClick={() => deleteTeam(member.id)}>{t.common.delete}</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {tab === 'partners' && (
              <>
                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.partners.addTitle}</h3>
                  </div>
                  <form onSubmit={handleAddPartner}>
                    <div className="form-group">
                      <label>{t.partners.name} ({t.common.required})</label>
                      <input type="text" value={partnerForm.name} onChange={(e) => setPartnerForm((prev) => ({ ...prev, name: e.target.value }))} placeholder={t.placeholders.partnerName} required />
                    </div>
                    <div className="form-group">
                      <label>{t.partners.url}</label>
                      <input type="url" value={partnerForm.url} onChange={(e) => setPartnerForm((prev) => ({ ...prev, url: e.target.value }))} placeholder={t.placeholders.partnerUrl} />
                    </div>
                    <button type="submit" className="btn-main">{t.common.add}</button>
                  </form>
                </div>

                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.partners.listTitle}</h3>
                    <span className="count-pill">{t.common.listCount}: {filteredPartners.length}</span>
                  </div>
                  <div className="list">
                    {filteredPartners.length === 0 ? (
                      <div className="empty-state">{search ? t.noResults : t.common.empty}</div>
                    ) : (
                      filteredPartners.map((p) => (
                        <div className="list-item" key={p.id}>
                          <div className="list-main">
                            <div className="list-text">
                              <div className="list-title">{p.name}</div>
                              {p.url ? <div className="list-meta">{p.url}</div> : null}
                            </div>
                          </div>
                          <div className="list-actions">
                            <button type="button" className="btn-delete" onClick={() => deletePartner(p.id)}>{t.common.delete}</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}

            {tab === 'info' && (
              <>
                <div className={`admin-card ${editingInfoId ? 'edit-mode' : ''}`}>
                  <div className="card-title">
                    <h3>{editingInfoId ? t.info.editTitle : t.info.addTitle}</h3>
                  </div>
                  <form onSubmit={handleSaveInfo}>
                    <div className="form-group">
                      <label>{t.info.key} ({t.common.required})</label>
                      <input type="text" value={infoForm.key} onChange={(e) => setInfoForm({ ...infoForm, key: e.target.value })} placeholder={t.placeholders.infoKey} required />
                    </div>
                    <div className="form-group">
                      <label>{t.info.title} ({t.common.required})</label>
                      <input type="text" value={infoForm.title} onChange={(e) => setInfoForm({ ...infoForm, title: e.target.value })} placeholder={t.placeholders.infoTitle} required />
                    </div>
                    <div className="form-group">
                      <label>{t.info.value}</label>
                      <input type="text" value={infoForm.value} onChange={(e) => setInfoForm({ ...infoForm, value: e.target.value })} placeholder={t.placeholders.infoValue} />
                    </div>
                    <div className="form-group">
                      <label>{t.info.type}</label>
                      <select value={infoForm.type} onChange={(e) => setInfoForm({ ...infoForm, type: e.target.value })}>
                        <option value="text">{t.info.typeText}</option>
                        <option value="email">{t.info.typeEmail}</option>
                        <option value="phone">{t.info.typePhone}</option>
                        <option value="social">{t.info.typeSocial}</option>
                        <option value="url">{t.info.typeUrl}</option>
                      </select>
                    </div>

                    {infoForm.type === 'social' && (
                      <>
                        <div className="form-group">
                          <label>{t.info.presets}</label>
                          <div className="preset-grid">
                            {SOCIAL_PRESETS.map((preset) => (
                              <button
                                key={preset.key}
                                type="button"
                                onClick={() => applySocialPreset(preset)}
                                className={`preset-btn ${infoForm.key === preset.key ? 'active' : ''}`}
                              >
                                {preset.title}
                              </button>
                            ))}
                          </div>
                          <div className="muted-note" style={{ marginTop: 8 }}>{t.info.presetHint}</div>
                        </div>

                        <div className="form-group">
                          <label>
                            {t.info.iconPreview}
                            <span className="icon-preview">{renderSocialIcon(infoForm)}</span>
                          </label>
                          <input type="text" value={infoForm.emoji} onChange={(e) => setInfoForm({ ...infoForm, emoji: e.target.value })} placeholder={t.info.emoji} />
                        </div>
                      </>
                    )}

                    <div className="form-group">
                      <label>{t.info.url}</label>
                      <input type="url" value={infoForm.url} onChange={(e) => setInfoForm({ ...infoForm, url: e.target.value })} placeholder={infoForm.type === 'social' ? getSocialUrlPlaceholder(infoForm) : t.placeholders.url} />
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-main">{editingInfoId ? t.common.update : t.common.add}</button>
                      {editingInfoId && <button type="button" className="btn-secondary" onClick={cancelEditInfo}>{t.common.cancel}</button>}
                    </div>
                  </form>
                </div>

                <div className="admin-card">
                  <div className="card-title">
                    <h3>{t.info.listTitle}</h3>
                    <span className="count-pill">{t.common.listCount}: {filteredInfo.length}</span>
                  </div>
                  <div className="list">
                    {filteredInfo.length === 0 ? (
                      <div className="empty-state">{search ? t.noResults : t.common.empty}</div>
                    ) : (
                      filteredInfo.map((item) => (
                        <div className="list-item" key={item.id}>
                          <div className="list-main">
                            <div className="list-text">
                              <div className="list-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="icon-preview" style={{ width: 28, height: 28, marginLeft: 0 }}>{item.type === 'social' ? renderSocialIcon(item) : (item.emoji || '•')}</span>
                                {item.title}
                              </div>
                              <div className="list-meta">{item.value || '-'} | {item.type}</div>
                            </div>
                          </div>
                          <div className="list-actions">
                            <button type="button" className="btn-edit" onClick={() => startEditInfo(item)}>{t.common.edit}</button>
                            <button type="button" className="btn-delete" onClick={() => deleteInfo(item.id)}>{t.common.delete}</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
