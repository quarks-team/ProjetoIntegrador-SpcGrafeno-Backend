# Let's use Python to create a visual representation (ER diagram) of the DDL with tables and relationships
from graphviz import Digraph

# Define the ER diagram
er_diagram = Digraph('ER Diagram', node_attr={'shape': 'record', 'fontname': 'Arial'})

# Adding User table to the diagram
er_diagram.node('users', '''{
    users |
    user_id : UUID PK |
    cnpj : VARCHAR(20) |
    consent_status : BOOLEAN |
    consent_date : TIMESTAMP |
    revocation_date : TIMESTAMP |
    partial_revocation : BOOLEAN |
    revocation_type : VARCHAR(255) |
    created_at : TIMESTAMP |
    updated_at : TIMESTAMP
}''')

# Adding consent_history table
er_diagram.node('consent_history', '''{
    consent_history |
    history_id : UUID PK |
    user_id : UUID FK |
    status_change : VARCHAR(50) |
    timestamp : TIMESTAMP |
    policy_version : INTEGER
}''')

# Adding policies table
er_diagram.node('policies', '''{
    policies |
    id : UUID PK |
    name : VARCHAR(255) |
    description : TEXT |
    version : INTEGER |
    created_at : TIMESTAMP |
    updated_at : TIMESTAMP |
    excluded_at : TIMESTAMP
}''')

# Adding user_policies table
er_diagram.node('user_policies', '''{
    user_policies |
    id : UUID PK |
    user_id : UUID FK |
    policy_id : UUID FK |
    accepted_at : TIMESTAMP
}''')

# Define the relationships
er_diagram.edge('consent_history', 'users', label='user_id', arrowhead='none', constraint='true')
er_diagram.edge('user_policies', 'users', label='user_id', arrowhead='none', constraint='true')
er_diagram.edge('user_policies', 'policies', label='policy_id', arrowhead='none', constraint='true')

# Now generating the Entity-Relationship Diagram
print(er_diagram)
