// Copyright (c) 2024, Tesar Rahmat Maulana and contributors
// For license information, please see license.txt

frappe.ui.form.on("School", {
	refresh(frm) {
        var school = frm.doc.domain
        frm.add_custom_button(__('Backup'), function() {
            frappe.call({
                method: 'siakadplus_admin.siakadplus_admin.doctype.school.school.backup',
                args: {
                    domain: school,
                },
                callback: function(response) {
                    frappe.msgprint(__('Backup successfully!'));
                }
            });
        });
        frm.add_custom_button(__('Go to Site'), function() {
            var site_url = `http://${school}.localhost:8001`;  // Ganti dengan URL situs baru yang sesuai
            window.open(site_url, "_blank");
        });
	},
});

frappe.ui.form.on('School Backup', {
    download: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        var site_name = `${frm.doc.domain}.localhost`;
        var file_name = child.file_name;

        let usr = 'administrator'
        let pwd = 'abcABC123#'
        pwd = encodeURIComponent(pwd);

        frappe.call({
            method: 'siakadplus_admin.siakadplus_admin.doctype.school.school.download_backup',
            args: {
                site_name: site_name,
                file_name: file_name
            },
            callback: function(response) {
                if (response.message && response.message.file_url) {
                    var file_url = response.message.file_url;
                    window.open(`http://${site_name}:8001/api/method/siakadplus.script.custom_login_and_redirect?user=${usr}&pwd=${pwd}&redirect_to=/backups/${file_name}`);
                } else {
                    frappe.msgprint(__('Unable to download the backup file'));
                }
                console.log(response)
            }
        });
    }
});
