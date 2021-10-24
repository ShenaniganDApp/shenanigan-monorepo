export default function usernameConcat(username: string | null | undefined) {
    if (!username) {
        return null;
    }

    if (username.slice(0, 2) === '0x') {
        return username.slice(0, 4) + '...' + username.slice(-4);
    } else {
        return username;
    }
}
