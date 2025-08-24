# Modular Architecture Overview

This project has been restructured to use Angular's NgModule-based modular architecture. The main changes are:

- **AppModule** bootstraps the application and provides global services.
- **AppRoutingModule** defines application routes and lazy loads feature modules.
- **Feature modules** (`BusinessSearchModule`, `MainPageModule`) group related components and routes.
- Standalone component configuration and application configuration files were removed in favor of module definitions.

Refer to individual modules for more details on their responsibilities and imported dependencies.
