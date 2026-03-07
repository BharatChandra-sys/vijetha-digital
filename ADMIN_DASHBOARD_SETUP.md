# Admin Dashboard - Comprehensive Guide

## Overview
The Vijetha Digital Admin Dashboard is a **production-ready management system** designed for non-technical users ("old uncle" friendly) to completely control their business without needing an operator.

## Features

### 1. **Dashboard Overview** 📊
- Real-time statistics:
  - Total Orders
  - Pending Orders (requires action)
  - Total Products in inventory
  - Total Revenue (currency: ₹)
- Quick reference guide for all admin functions

### 2. **Product Management** 📦

#### Create Products
- **Product Name**: Clear name for the product
- **Category**: Printing, Design Services, Packaging, Promotional Items
- **Price**: Set in Indian Rupees (₹)
- **Stock Quantity**: How many units available
- **Product Types**: Multiple options (e.g., Matte, Glossy, Premium)
- **Available Sizes**: Options like A4, A5, Custom
- **Description**: Detailed info about the product
- **Image Upload**: Product photo for display

#### Edit Products
- Click ✏️ Edit on any product
- Modify any field above
- Upload new image if needed
- Changes reflect immediately on the website

#### Delete Products
- Click 🗑️ Delete on any product
- System will ask for confirmation
- Deleted products disappear from website instantly

### 3. **Order Management** 📋

#### View All Orders
- See complete list of customer orders
- Filter by status:
  - **Pending**: New orders waiting to be processed
  - **Processing**: Orders being fulfilled
  - **Completed**: Finished orders ready for delivery
  - **Cancelled**: Orders that were cancelled

#### Track Order Details
- Click on any order to see:
  - Customer name, email, phone
  - Order total amount
  - Complete list of items ordered with quantities
  - Customer delivery address

#### Update Order Status
- As you work on an order, update its status:
  1. **Pending** → New order received
  2. **Processing** → Being prepared/printed
  3. **Completed** → Ready for delivery/pickup
  4. **Cancelled** → If order cancel is requested

- **Important**: Status changes automatically notify the customer

### 4. **Staff Management** 👥

#### Add Team Members
- **Full Name**: Staff member's complete name
- **Position**: Manager, Operator, Designer, etc.
- **Phone Number**: Direct contact (e.g., +91 98765 43210)
- **Email**: Work email address
- **Department**: 
  - Production (printing, manufacturing)
  - Design (graphic design)
  - Sales (customer interaction)
  - Administration (office management)
  - Delivery (logistics)
- **Status**: 
  - Active (working normally)
  - Inactive (not available)
  - On Leave (temporary absence)

#### Edit Staff Information
- Update any staff member details
- Change phone number, email
- Update department assignments
- Mark as on leave or inactive

#### Delete Staff
- Remove staff member from system
- Confirmation required

## User Interface Design

### Color Scheme (Vijetha Branding)
- **Primary**: Plum Deep (#3B2F63) - Professional, trustworthy
- **Accent**: Coral (#FF6B5E) - Attention-grabbing for buttons
- **Background**: Warm White (#FBF9F4) - Easy on eyes

### Navigation
- **Sidebar**: Easy access to all 4 main sections
- **Icons**: Visual indicators for quick recognition
- **Large Text**: Easy to read (for older users)
- **High Contrast**: Numbers and text stand out clearly

### Actions & Buttons
- **Green**: For active/positive actions
- **Blue**: For edit/information actions
- **Red**: For delete/warning actions
- **Easy to Click**: Large button sizes

## API Endpoints

### Dashboard Statistics
```
GET /admin/dashboard/stats
```
Response:
```json
{
  "totalOrders": 45,
  "totalProducts": 12,
  "pendingOrders": 3,
  "totalRevenue": 125000
}
```

### Product Management
```
POST   /admin/dashboard/products        - Create product
GET    /admin/dashboard/products        - List all products
PUT    /admin/dashboard/products/{id}   - Update product
DELETE /admin/dashboard/products/{id}   - Delete product
```

### Order Management
```
GET    /admin/dashboard/orders                      - List all orders
PUT    /admin/dashboard/orders/{orderId}/status     - Update order status
```

### Staff Management
```
POST   /admin/dashboard/staff           - Add staff member
GET    /admin/dashboard/staff           - List all staff
PUT    /admin/dashboard/staff/{id}      - Update staff info
DELETE /admin/dashboard/staff/{id}      - Delete staff member
```

## Database Models

### Staff Table
```
id              INTEGER PRIMARY KEY
name            VARCHAR(255) - Staff member name
position        VARCHAR(255) - Job title
phone           VARCHAR(20)  - Contact number
email           VARCHAR(255) - Email address
department      VARCHAR(100) - Department name
status          VARCHAR(50)  - active/inactive/on_leave
created_at      DATETIME     - When record was created
updated_at      DATETIME     - Last update time
```

## Setup Instructions

### Backend
1. The Staff model is created in `app/models/staff.py`
2. Routes are integrated into `app/api/admin/router.py`
3. All admin functionality requires `admin_required` permission

### Frontend
1. Main component: `frontend/src/pages/Admin/AdminDashboard.jsx`
2. Accessed at: `/admin/dashboard`
3. Requires admin authentication

### Initial Database Migration (if needed)
```bash
# Run migrations to create staff table
alembic revision --autogenerate -m "Add staff table"
alembic upgrade head
```

## Important Notes for Admin Users

### ✅ DO:
- Review pending orders daily
- Update order status as work progresses
- Keep staff contact information current
- Maintain accurate product inventory
- Regularly backup product data

### ❌ DON'T:
- Delete products that customers might reference
- Update order status multiple times rapidly
- Leave large order quantities unaddressed
- Share admin credentials with non-admin staff

## Troubleshooting

### Problem: Can't see orders
**Solution**: Check if status filter is set correctly. Default shows "all" statuses.

### Problem: Changes not showing immediately
**Solution**: Refresh the page (F5 or Ctrl+R). System updates within seconds.

### Problem: Can't add staff member
**Solution**: Ensure all required fields (Name, Position, Phone, Department) are filled.

### Problem: Product image not uploading
**Solution**: Check file size (max 5MB) and format (JPG, PNG only).

## Feature Highlights

### Real-time Sync
- All changes across dashboard appear instantly
- No need to refresh pages
- Automatic notifications to customers when order status changes

### User-Friendly
- Large fonts and clear labels
- Emoji indicators (📦 Products, 📋 Orders, 👥 Staff)
- Organized layout for easy navigation
- Confirmation dialogs to prevent accidents

### Complete Control
Admin can manage:
- ✅ ALL products (create, edit, delete)
- ✅ ALL orders (view, update status, track)
- ✅ ALL staff (add, edit, remove)
- ✅ Business metrics & revenue
- ✅ Customer communication via order updates

## Support

For technical issues or questions about the admin dashboard, contact:
- **Email**: info@vijethadigital.com
- **Phone**: +91 79426 43004 or +91 98480 12345
- **GST**: 36AGBPC3175H1ZP

---

**Version**: 1.0  
**Last Updated**: March 8, 2026  
**Vijetha Digital - Est. 2002**
