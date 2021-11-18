// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        function onInit(){
            //Vista
            let oView = this.getView();
            //Cargar modelos de Paises
            let jsonPaisesModel = new JSONModel();
            //cargar json desde un archivo en el LocalService
            jsonPaisesModel.loadData("./localService/paises.json", false);
            // vincular el modelo a la vista
            console.log("prueba");
            oView.setModel(jsonPaisesModel, "paisesModel");
            //Cargar modelo de solicitudes
            let jsonSolicitudesModel = new JSONModel();
            jsonSolicitudesModel.loadData("./localService/solicitudes.json",false);
            oView.setModel(jsonSolicitudesModel, "jsonSolicitudesModel");
        };

        function onFilter() {
          let paises = this.getView().getModel("paisesModel").getData(); 
          let aFilters = [];
          if(paises.paisSeleccionado !== "" && paises.paisSeleccionado !== undefined){
              aFilters.push(new Filter("Country", FilterOperator.EQ, paises.paisSeleccionado));
          }
          
          let $tableEmp = this.getView().byId("idTable");
          let oBinding = $tableEmp.getBinding("items");
          oBinding.filter(aFilters);

        };

        function onShowRequests(oEvent){
           const $tableRequests = this.getView().byId("tableRequests");
           $tableRequests.destroyItems();
           const pressedItem = oEvent.getSource();
           const oContext = pressedItem.getBindingContext("northwind");
          // const sPath = oContext.getPath();
          const objectContext = oContext.getObject();
          const employeeID = objectContext.EmployeeID;

          //armar lista de solicitudes para el empleado seleccionado
          let reqData = this.getView().getModel("jsonSolicitudesModel").getData().solicitudes;
          //FiltrerOperator
          let reqFiltered = [];
          reqFiltered = reqData.filter((elem)=>{
              return elem.empleadoId === employeeID;
          });
          let aCuentas = reqFiltered[0].cuentas;

             // armar tabla
           let requestItems = [];
           for(let i in aCuentas){
               requestItems.push(new sap.m.ColumnListItem({
                   cells: [
                       new sap.m.Label({text: aCuentas[i].numero}),
                       new sap.m.Label({text: aCuentas[i].nombre})
                   ]
               }));
           };
           
           let newTable = new sap.m.Table({
               witdth: "auto",
               columns: [
                   new sap.m.Column({header: new sap.m.Label({text: "{i18n>requestNumber}"})}),
                   new sap.m.Column({header: new sap.m.Label({text: "{i18n>requestName}"})}),
               ],
               items: requestItems
           });

           $tableRequests.addItem(newTable);
           
        };

        var Main = Controller.extend("amas.sapui5.controller.Main", {});

        Main.prototype.onInit = onInit;
        Main.prototype.onFilter = onFilter;
        Main.prototype.onShowRequests = onShowRequests;
        return Main;

    });
