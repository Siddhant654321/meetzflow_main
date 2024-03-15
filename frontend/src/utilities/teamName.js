const teamName = (name) => {
    const convertedString = name.toLowerCase().replace(/\s+/g, '-').trim();
    return convertedString;
}

export default teamName;