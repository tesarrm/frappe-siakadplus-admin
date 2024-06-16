// Copyright (c) 2024, Tesar Rahmat Maulana and contributors
// For license information, please see license.txt

frappe.ui.form.on("School", {
	refresh(frm) {
        // Add a button "Go to Site"
        var school = frm.doc.domain

        frm.add_custom_button(__('Go to Site'), function() {
            var site_url = `http://${school}.localhost:8001`;  // Ganti dengan URL situs baru yang sesuai
            window.open(site_url, "_blank");
        });
	},
});
