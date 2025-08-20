# Modal Components Documentation

This document describes the modal-based components created for the SuperAdmin panel's view, edit, and delete functionality.

## Components Overview

### 1. Base Modal Component (`src/components/common/Modal.js`)
A reusable modal wrapper with:
- Backdrop click to close
- Escape key to close
- Body scroll lock when open
- Smooth animations using Framer Motion
- Multiple size options (sm, md, lg, xl)
- Responsive design

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when closing
- `title`: Modal header title
- `children`: Modal content
- `size`: Modal size ('sm', 'md', 'lg', 'xl')

### 2. Confirmation Modal (`src/components/common/ConfirmModal.js`)
A specialized modal for delete confirmations with:
- Different types (danger, warning, info)
- Customizable messages and button text
- Icon based on type
- Built-in confirmation handling

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when closing
- `onConfirm`: Function to call when confirming
- `title`: Modal title
- `message`: Confirmation message
- `confirmText`: Text for confirm button (default: 'Delete')
- `cancelText`: Text for cancel button (default: 'Cancel')
- `type`: Modal type ('danger', 'warning', 'info')

## Student Management Modals

### 3. View Student Modal (`src/components/pages/SuperAdmin/Students/ViewStudentModal.js`)
Displays comprehensive student information including:
- Basic information (name, phone, status, joining date)
- Owner details
- Category information
- Discount details
- Timestamps

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when closing
- `student`: Student object to display

### 4. Edit Student Modal (`src/components/pages/SuperAdmin/Students/EditStudentModal.js`)
Form for editing student information with:
- All editable fields
- Form validation
- API integration for updates
- Real-time form state management

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when closing
- `student`: Student object to edit
- `onUpdate`: Function to call after successful update
- `categories`: Array of available categories
- `owners`: Array of available owners

## Owner Management Modals

### 5. View Owner Modal (`src/components/pages/SuperAdmin/Owners/ViewOwnerModal.js`)
Displays owner information including:
- Basic details (name, phone, subdomain, status)
- SMS configuration
- Statistics (students, categories, rents, complaints)
- Timestamps

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when closing
- `owner`: Owner object to display

### 6. Edit Owner Modal (`src/components/pages/SuperAdmin/Owners/EditOwnerModal.js`)
Form for editing owner information with:
- Basic information fields
- SMS configuration options
- Form validation
- API integration

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to call when closing
- `owner`: Owner object to edit
- `onUpdate`: Function to call after successful update

## Usage Examples

### Basic Modal Usage
```jsx
import Modal from '@/components/common/Modal';

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="My Modal">
      <p>Modal content goes here</p>
    </Modal>
  );
};
```

### Confirmation Modal Usage
```jsx
import ConfirmModal from '@/components/common/ConfirmModal';

const MyComponent = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    // Delete logic here
    console.log('Item deleted');
  };

  return (
    <ConfirmModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleDelete}
      title="Delete Item"
      message="Are you sure you want to delete this item?"
      confirmText="Delete"
      type="danger"
    />
  );
};
```

### Student Modal Integration
```jsx
import ViewStudentModal from './ViewStudentModal';
import EditStudentModal from './EditStudentModal';

const StudentList = () => {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleView = (id) => {
    const student = students.find(s => s.id === id);
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleEdit = (id) => {
    const student = students.find(s => s.id === id);
    setSelectedStudent(student);
    setEditModalOpen(true);
  };

  return (
    <>
      {/* Your table/list component */}
      
      <ViewStudentModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        student={selectedStudent}
      />
      
      <EditStudentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={selectedStudent}
        onUpdate={() => fetchStudents()}
        categories={categories}
        owners={owners}
      />
    </>
  );
};
```

## Features

### Accessibility
- Keyboard navigation (Escape to close)
- Focus management
- Screen reader friendly

### Responsive Design
- Mobile-first approach
- Adaptive sizing
- Touch-friendly interactions

### Animation
- Smooth enter/exit animations
- Backdrop blur effects
- Performance optimized

### State Management
- Controlled component pattern
- Proper cleanup on unmount
- Error handling

## Styling

All modals use Tailwind CSS classes and follow the existing design system:
- Dark theme (gray-800, gray-900)
- Consistent spacing and typography
- Hover effects and transitions
- Responsive grid layouts

## Dependencies

- **Framer Motion**: For animations
- **React**: For component logic
- **Tailwind CSS**: For styling
- **react-hot-toast**: For notifications (in edit modals)

## Notes

- All modals automatically handle authentication tokens from cookies
- Form validation is built-in for required fields
- API calls include proper error handling
- Modals are designed to work with the existing DataTable component
- All modals support both mouse and keyboard interactions
