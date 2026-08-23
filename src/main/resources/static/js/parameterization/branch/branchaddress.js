function parseBranchAddress(addressStr) {
    const components = {
        country: '',
        province: '',
        city: '',
        streetAddress: ''
    };

    if (!addressStr) return components;

    const separators = [',', ';', '|'];
    let parts = [addressStr];

    for (const sep of separators) {
        if (addressStr.includes(sep)) {
            parts = addressStr.split(sep).map(part => part.trim());
            break;
        }
    }

    switch(parts.length) {
        case 4:
            components.country = parts[0];
            components.province = parts[1];
            components.city = parts[2];
            components.streetAddress = parts[3];
            break;
        case 3:
            components.province = parts[0];
            components.city = parts[1];
            components.streetAddress = parts[2];
            break;
        case 2:
            components.city = parts[0];
            components.streetAddress = parts[1];
            break;
        default:
            components.streetAddress = parts[0];
    }

    return components;
}