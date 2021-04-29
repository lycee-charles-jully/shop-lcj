export enum BackupOrigin {
    /** When a manual backup is issued via the API */
    MANUAL = 'manual',

    /** Automatic backup issued frequently */
    AUTOMATIC = 'automatic',

    /** When a backup is restored */
    OVERWRITE = 'overwrite',
}