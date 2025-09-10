export function isSameDay(utcCreatedAt) {
    const createdDate = new Date(utcCreatedAt); // ISO timestamp from DB
    const now = new Date();

    // Convert both to UTC-based date-only strings (no time)
    const createdDateStr = createdDate.toISOString().split('T')[0];
    const nowDateStr = now.toISOString().split('T')[0];

    console.log(createdDateStr === nowDateStr);

    return createdDateStr === nowDateStr;
}