
export function emailValid(email) {
    const emailRegex = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return emailRegex.test(email);
}

export const formatCurrency = (value) => {
    value = Math.round(value * 100) / 100;

    const formatter = new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return formatter.format(value);
}

export const validatePhoneNumber = (phoneNumber) => {
    if (typeof phoneNumber !== 'string') {
        phoneNumber = String(phoneNumber);
    }

    const normalized = phoneNumber.replace(/[^+\d]/g, '').trim();

    const phoneRegex = /^(?:\+90|0)?(?:5\d{9}|[2-9]\d{2}\d{7})$/;

    return phoneRegex.test(normalized);
};
