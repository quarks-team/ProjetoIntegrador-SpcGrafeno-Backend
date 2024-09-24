-- Table for storing users and their consent status
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
    cnpj VARCHAR(20) NOT NULL, -- CNPJ (company identifier) for the user
    consent_status BOOLEAN NOT NULL DEFAULT FALSE, -- Indicates whether the terms are accepted
    consent_date TIMESTAMP, -- Timestamp of when the terms were accepted
    revocation_date TIMESTAMP, -- Timestamp of revocation of consent, if applicable
    partial_revocation BOOLEAN DEFAULT FALSE, -- Indicates if partial revocation occurred
    revocation_type VARCHAR(255), -- Describes access lost due to partial revocation
    created_at TIMESTAMP DEFAULT NOW(), -- Timestamp when the user was created
    updated_at TIMESTAMP DEFAULT NOW() -- Timestamp when the user was last updated
);

-- Table for logging the history of consent changes
CREATE TABLE consent_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the history record
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE, -- Foreign key to users table
    status_change VARCHAR(50) NOT NULL, -- Status change (e.g., Accepted, Partial Revocation, Full Revocation)
    timestamp TIMESTAMP DEFAULT NOW() NOT NULL, -- Timestamp of the status change
    policy_version INTEGER, -- Version of the policy at the time of consent or revocation
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE -- Foreign key linking to users
);

-- Table for storing policies (terms of use)
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the policy
    name VARCHAR(255) NOT NULL, -- Name of the policy
    description TEXT, -- Description of the policy
    version INTEGER NOT NULL, -- Version number of the policy
    created_at TIMESTAMP DEFAULT NOW(), -- Timestamp when the policy was created
    updated_at TIMESTAMP DEFAULT NOW(), -- Timestamp when the policy was last updated
    excluded_at TIMESTAMP -- Timestamp for soft deletion of the policy, if applicable
);

-- Table for linking users to policies they've accepted
CREATE TABLE user_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user-policy link
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE, -- Reference to the user
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE, -- Reference to the policy
    accepted_at TIMESTAMP DEFAULT NOW() -- Timestamp when the user accepted the policy
);
