# Hangar and Vehicle Plan

## 1. Hangar and Vehicle List UI (Initial Integration):
- [x] In HangarModal, display a vehicle list with status indicators (vehicles are either "ready" or "on mission")
- [x] Show basic stats such as crew count, speed, range, and associated costs
- [x] Add click/hover interactions that trigger a detailed view when a vehicle is selected
- [x] On vehicle selection, open VehicleDetailModal

## 2. Vehicle Details View (VehicleDetailModal):
- [x] Build a tabbed interface with the following tabs:
   - **Info**: Display vehicle name, status, condition, and base stats with modifiers
   - **Crew**: List assigned crew along with assign/remove buttons
- [x] Ensure each tab has clear call-to-action buttons (e.g., "Assign Crew") that open modals or trigger state updates

## 3. Crew Management UI:
- [x] In the Crew tab, implement UI for crew assignment:
   - A button labeled "Assign Crew" that opens a personnel selection modal
   - A remove icon/button next to each crew member for removal actions
- [x] Display crew roles, specializations, and effectiveness via progress bars or numeric indicators

## 4. Status and Feedback:
- [x] Ensure that every UI action (vehicle selection, crew assignment, etc.) updates status indicators appropriately
- [x] Implement common error handling dialogs to show validation errors (e.g., personnel already assigned)
- [x] Add confirmation dialogs for critical actions like assigning crew

## 5. Step-by-Step Integration Testing:
- [x] After implementing UI changes for each tab, test interactions with mocked state updates
- [x] Verify that clicking buttons triggers the intended actions and that modals/dialogs display the correct information