function getChannelUrl(channelId) {
    try {
        const filePath = path.join(__dirname, 'channels.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const channels = JSON.parse(fileData);
        
        // البحث عن الكائن الذي يطابق معرّف القناة المطلوبة
        const channel = channels.find(c => c.id === channelId);
        return channel ? channel.url : null;
    } catch (error) {
        console.error("خطأ في قراءة مصفوفة القنوات:", error);
        return null;
    }
}
