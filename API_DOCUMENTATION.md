# Super Admin API Documentation

## Overview
This document describes the comprehensive APIs for managing students and owners (admins) in the super admin system. All APIs require super admin authentication and include advanced filtering, search, and pagination capabilities.

## Authentication
All APIs require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Base URL
```
/api/super-admin
```

---

## Students Management

### 1. List Students
**GET** `/api/super-admin/students`

Get a paginated list of students with advanced filtering and search.

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 10 |
| `search` | string | Global search across name, phone, and owner | - |
| `name` | string | Filter by student name | - |
| `phone` | string | Filter by phone number | - |
| `owner` | string | Filter by owner name | - |
| `status` | string | Filter by status (living, leave) | - |
| `categoryId` | number | Filter by category ID | - |
| `ownerId` | number | Filter by owner ID | - |

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Emma Johnson",
      "phone": "(617) 555-0123",
      "smsPhone": "(617) 555-0123",
      "status": "living",
      "joiningDate": "2024-01-15T00:00:00.000Z",
      "owner": {
        "id": 1,
        "name": "Michael Chen",
        "phone": "(617) 555-0000",
        "subdomain": "michael-student"
      },
      "categoryRef": {
        "id": 1,
        "title": "Standard Room",
        "rentAmount": 500
      },
      "discountRef": {
        "id": 1,
        "title": "Reference Discount",
        "discountAmount": 50
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

### 2. Get Student by ID
**GET** `/api/super-admin/students/{id}`

Get detailed information about a specific student.

#### Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Emma Johnson",
    "phone": "(617) 555-0123",
    "smsPhone": "(617) 555-0123",
    "status": "living",
    "joiningDate": "2024-01-15T00:00:00.000Z",
    "owner": {
      "id": 1,
      "name": "Michael Chen",
      "phone": "(617) 555-0000",
      "subdomain": "michael-student",
      "smsActivation": true,
      "smsAmount": 250
    },
    "categoryRef": {
      "id": 1,
      "title": "Standard Room",
      "rentAmount": 500,
      "externalAmount": 50,
      "description": "Standard accommodation"
    },
    "discountRef": {
      "id": 1,
      "title": "Reference Discount",
      "discountAmount": 50
    },
    "rents": [
      {
        "id": 1,
        "rentAmount": 500,
        "status": "paid",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ],
    "rentHistory": [
      {
        "id": 1,
        "rentMonth": "2024-01",
        "status": "paid",
        "paidDate": "2024-01-15T00:00:00.000Z",
        "dueRent": 500,
        "paidRent": 500
      }
    ]
  }
}
```

### 3. Create Student
**POST** `/api/super-admin/students`

Create a new student.

#### Request Body
```json
{
  "name": "Emma Johnson",
  "phone": "(617) 555-0123",
  "smsPhone": "(617) 555-0123",
  "password": "securepassword",
  "profileImage": "https://example.com/image.jpg",
  "hideRanking": 0,
  "status": "living",
  "categoryId": 1,
  "referenceId": null,
  "discountId": null,
  "discountAmount": 0,
  "bookingAmount": 0,
  "joiningDate": "2024-01-15",
  "ownerId": 1
}
```

#### Response
```json
{
  "success": true,
  "message": "Student created successfully",
  "data": {
    "id": 1,
    "name": "Emma Johnson",
    "phone": "(617) 555-0123",
    "status": "living"
  }
}
```

### 4. Update Student
**PUT** `/api/super-admin/students/{id}`

Update an existing student.

#### Request Body
```json
{
  "name": "Emma Johnson Updated",
  "status": "leave",
  "discountAmount": 100
}
```

#### Response
```json
{
  "success": true,
  "message": "Student updated successfully",
  "data": {
    "id": 1,
    "name": "Emma Johnson Updated",
    "status": "leave"
  }
}
```

### 5. Delete Student
**DELETE** `/api/super-admin/students/{id}`

Delete a student (only if no related data exists).

#### Response
```json
{
  "success": true,
  "message": "Student deleted successfully"
}
```

---

## Owners Management

### 1. List Owners
**GET** `/api/super-admin/owners`

Get a paginated list of owners with advanced filtering and search.

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `page` | number | Page number | 1 |
| `limit` | number | Items per page | 10 |
| `search` | string | Global search across name, phone, and subdomain | - |
| `name` | string | Filter by owner name | - |
| `phone` | string | Filter by phone number | - |
| `subdomain` | string | Filter by subdomain | - |
| `status` | string | Filter by status (active, inactive, suspended) | - |
| `smsActivation` | boolean | Filter by SMS activation status | - |

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Michael Chen",
      "phone": "(617) 555-0000",
      "subdomain": "michael-student",
      "smsActivation": true,
      "smsAmount": 250,
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "_count": {
        "students": 15,
        "categories": 3,
        "rents": 45,
        "complaints": 2
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalCount": 25,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false,
    "nextPage": 2,
    "prevPage": null
  }
}
```

### 2. Get Owner by ID
**GET** `/api/super-admin/owners/{id}`

Get detailed information about a specific owner.

#### Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Michael Chen",
    "phone": "(617) 555-0000",
    "subdomain": "michael-student",
    "smsActivation": true,
    "smsAmount": 250,
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "_count": {
      "students": 15,
      "categories": 3,
      "rents": 45,
      "complaints": 2,
      "discounts": 1,
      "payments": 30
    },
    "students": [
      {
        "id": 1,
        "name": "Emma Johnson",
        "phone": "(617) 555-0123",
        "status": "living",
        "joiningDate": "2024-01-15T00:00:00.000Z"
      }
    ],
    "categories": [
      {
        "id": 1,
        "title": "Standard Room",
        "rentAmount": 500,
        "status": 1
      }
    ]
  }
}
```

### 3. Create Owner
**POST** `/api/super-admin/owners`

Create a new owner.

#### Request Body
```json
{
  "name": "Michael Chen",
  "phone": "(617) 555-0000",
  "password": "securepassword",
  "subdomain": "michael-student",
  "smsActivation": true,
  "smsAmount": 250
}
```

#### Response
```json
{
  "success": true,
  "message": "Owner created successfully",
  "data": {
    "id": 1,
    "name": "Michael Chen",
    "phone": "(617) 555-0000",
    "subdomain": "michael-student",
    "smsActivation": true,
    "smsAmount": 250,
    "status": "active",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Owner
**PUT** `/api/super-admin/owners/{id}`

Update an existing owner.

#### Request Body
```json
{
  "name": "Michael Chen Updated",
  "smsActivation": false,
  "smsAmount": 500
}
```

#### Response
```json
{
  "success": true,
  "message": "Owner updated successfully",
  "data": {
    "id": 1,
    "name": "Michael Chen Updated",
    "smsActivation": false,
    "smsAmount": 500,
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

### 5. Delete Owner
**DELETE** `/api/super-admin/owners/{id}`

Delete an owner (only if no related data exists).

#### Response
```json
{
  "success": true,
  "message": "Owner deleted successfully"
}
```

---

## Categories Management

### 1. List Categories
**GET** `/api/super-admin/categories`

Get all categories for reference data.

#### Query Parameters
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `ownerId` | number | Filter by owner ID | - |

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Standard Room",
      "rentAmount": 500,
      "externalAmount": 50,
      "description": "Standard accommodation",
      "status": 1,
      "owner": {
        "id": 1,
        "name": "Michael Chen",
        "subdomain": "michael-student"
      },
      "_count": {
        "students": 15,
        "rents": 45
      }
    }
  ]
}
```

---

## Error Responses

### Authentication Error
```json
{
  "message": "Authentication required",
  "status": 401
}
```

### Validation Error
```json
{
  "message": "Missing required fields",
  "status": 400
}
```

### Conflict Error
```json
{
  "message": "Phone number already exists",
  "status": 409
}
```

### Not Found Error
```json
{
  "message": "Student not found",
  "status": 404
}
```

### Server Error
```json
{
  "message": "Internal server error",
  "error": "Error details",
  "status": 500
}
```

---

## Frontend Components

### 1. Pagination Component
Professional pagination with page size selection, jump to page, and responsive design.

**Props:**
- `currentPage`: Current page number
- `totalPages`: Total number of pages
- `totalCount`: Total number of items
- `limit`: Items per page
- `onPageChange`: Function to handle page changes
- `onLimitChange`: Function to handle limit changes
- `showPageSize`: Show page size selector (default: true)
- `showJumpTo`: Show jump to page input (default: true)
- `showInfo`: Show page info (default: true)

### 2. Search and Filter Component
Advanced search and filtering with multiple input types and debounced search.

**Props:**
- `filters`: Array of filter configurations
- `onFiltersChange`: Function to handle filter changes
- `onSearch`: Function to handle search (debounced)
- `searchPlaceholder`: Placeholder for search input
- `showClearButton`: Show clear all button (default: true)

**Filter Types:**
- `text`: Text input
- `select`: Dropdown selection
- `multiselect`: Multiple selection dropdown
- `boolean`: Yes/No/All selection
- `date`: Date picker
- `number`: Number input with min/max/step

### 3. Data Table Component
Professional data table with sorting, row selection, actions, and responsive design.

**Props:**
- `data`: Array of data items
- `columns`: Array of column configurations
- `actions`: Array of action buttons
- `onRowClick`: Function to handle row clicks
- `selectable`: Enable row selection (default: false)
- `onSelectionChange`: Function to handle selection changes
- `loading`: Show loading state (default: false)
- `emptyMessage`: Message when no data (default: "No data found")

**Column Types:**
- `text`: Plain text
- `date`: Formatted date
- `datetime`: Formatted date and time
- `currency`: Formatted currency
- `number`: Formatted number
- `status`: Status badge with custom colors
- `boolean`: Yes/No badge

---

## Usage Examples

### Students List with Filters
```javascript
const studentFilters = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Search by name' },
  { key: 'phone', label: 'Phone', type: 'text', placeholder: 'Search by phone' },
  { key: 'owner', label: 'Owner', type: 'text', placeholder: 'Search by owner' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'living', label: 'Living' },
    { value: 'leave', label: 'Leave' }
  ]},
  { key: 'categoryId', label: 'Category', type: 'select', options: categories }
];

const handleFiltersChange = (filters) => {
  // Update API call with new filters
  fetchStudents(filters);
};

const handleSearch = (searchTerm) => {
  // Update API call with search term
  fetchStudents({ ...currentFilters, search: searchTerm });
};
```

### Owners List with Advanced Filters
```javascript
const ownerFilters = [
  { key: 'name', label: 'Name', type: 'text', placeholder: 'Search by name' },
  { key: 'phone', label: 'Phone', type: 'text', placeholder: 'Search by phone' },
  { key: 'subdomain', label: 'Subdomain', type: 'text', placeholder: 'Search by subdomain' },
  { key: 'status', label: 'Status', type: 'select', options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ]},
  { key: 'smsActivation', label: 'SMS Status', type: 'boolean' }
];
```

---

## Best Practices

1. **Pagination**: Always implement pagination for large datasets
2. **Search**: Use debounced search to avoid excessive API calls
3. **Filtering**: Combine multiple filters for precise data retrieval
4. **Error Handling**: Implement proper error handling for all API calls
5. **Loading States**: Show loading indicators during API calls
6. **Validation**: Validate input data before sending to APIs
7. **Security**: Never expose sensitive data in responses
8. **Performance**: Use appropriate database indexes for search and filter fields

---

## Rate Limiting
APIs are rate-limited to prevent abuse. Implement proper error handling for rate limit responses.

---

## Support
For technical support or questions about the APIs, please contact the development team.
