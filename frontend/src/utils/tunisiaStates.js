// frontend/src/utils/tunisiaStates.js

export const tunisiaStates = [
    { code: 'TU-11', name: 'Tunis', nameAr: 'تونس' },
    { code: 'TU-12', name: 'Ariana', nameAr: 'أريانة' },
    { code: 'TU-13', name: 'Ben Arous', nameAr: 'بن عروس' },
    { code: 'TU-14', name: 'Manouba', nameAr: 'منوبة' },
    { code: 'TU-21', name: 'Nabeul', nameAr: 'نابل' },
    { code: 'TU-22', name: 'Zaghouan', nameAr: 'زغوان' },
    { code: 'TU-23', name: 'Bizerte', nameAr: 'بنزرت' },
    { code: 'TU-31', name: 'Béja', nameAr: 'باجة' },
    { code: 'TU-32', name: 'Jendouba', nameAr: 'جندوبة' },
    { code: 'TU-33', name: 'Kef', nameAr: 'الكاف' },
    { code: 'TU-34', name: 'Siliana', nameAr: 'سليانة' },
    { code: 'TU-41', name: 'Kairouan', nameAr: 'القيروان' },
    { code: 'TU-42', name: 'Kasserine', nameAr: 'القصرين' },
    { code: 'TU-43', name: 'Sidi Bouzid', nameAr: 'سيدي بوزيد' },
    { code: 'TU-51', name: 'Sousse', nameAr: 'سوسة' },
    { code: 'TU-52', name: 'Monastir', nameAr: 'المنستير' },
    { code: 'TU-53', name: 'Mahdia', nameAr: 'المهدية' },
    { code: 'TU-61', name: 'Sfax', nameAr: 'صفاقس' },
    { code: 'TU-71', name: 'Gafsa', nameAr: 'قفصة' },
    { code: 'TU-72', name: 'Tozeur', nameAr: 'توزر' },
    { code: 'TU-73', name: 'Kebili', nameAr: 'قبلي' },
    { code: 'TU-81', name: 'Gabès', nameAr: 'قابس' },
    { code: 'TU-82', name: 'Medenine', nameAr: 'مدنين' },
    { code: 'TU-83', name: 'Tataouine', nameAr: 'تطاوين' },
];

export const getStateByCode = (code) => {
    return tunisiaStates.find(state => state.code === code);
};

export const getStateByName = (name) => {
    return tunisiaStates.find(state =>
        state.name.toLowerCase() === name.toLowerCase() ||
        state.nameAr === name
    );
};
