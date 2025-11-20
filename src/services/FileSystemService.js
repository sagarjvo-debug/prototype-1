
const STORAGE_PREFIX = 'antigravity_fs_';

class FileSystemService {
    constructor() {
        this.init();
    }

    init() {
        // Initialize default directories if they don't exist in "virtual" file system
        const defaults = [
            'src/data/conversations',
            'src/data/brain',
            'src/data/context_state',
            'src/data/logs'
        ];

        defaults.forEach(dir => {
            if (!this.exists(dir)) {
                this.mkdir(dir);
            }
        });
    }

    // Helper to get full key
    _getKey(path) {
        return `${STORAGE_PREFIX}${path}`;
    }

    // Check if file/directory exists
    exists(path) {
        return localStorage.getItem(this._getKey(path)) !== null;
    }

    // Create directory (just a marker in this simple FS)
    mkdir(path) {
        localStorage.setItem(this._getKey(path), JSON.stringify({ type: 'directory', created: new Date().toISOString() }));
    }

    // Write JSON file
    saveJson(path, data) {
        const meta = {
            type: 'file',
            content: data,
            updated: new Date().toISOString()
        };
        localStorage.setItem(this._getKey(path), JSON.stringify(meta));
        console.log(`[FS] Saved ${path}`);
    }

    // Read JSON file
    loadJson(path) {
        const item = localStorage.getItem(this._getKey(path));
        if (!item) return null;
        try {
            const parsed = JSON.parse(item);
            return parsed.content;
        } catch (e) {
            console.error(`[FS] Error loading ${path}`, e);
            return null;
        }
    }

    // List files in a directory (naive implementation by scanning all keys)
    listFiles(directory) {
        const files = [];
        const prefix = this._getKey(directory);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix) && key !== prefix) {
                // Extract relative path
                const relative = key.substring(STORAGE_PREFIX.length);
                // Check if it's a direct child (not perfect but works for flat structure per folder)
                // For now, just return everything that starts with the path
                files.push(relative);
            }
        }
        return files.sort();
    }

    // Generate a UUID
    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export const fileSystem = new FileSystemService();
