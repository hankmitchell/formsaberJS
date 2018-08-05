// formsSaberJS by Hank Mitchell
// formsaber.com for more info
// free software
// Enjoy!
function formSaberJS(id) {
	// pass in the ID of the element that formSaber will parse (textarea)
	var payload = document.getElementById(id).value;
	console.log("FormsaberJS by Hank Mitchell");
	var i,
		q,
		iinc,
		t = "",
		required = "",
		NOTE = "",
		HEADLINE = "",
		TEXTAREA = "",
		CHECKBOX = "",
		CHECKED = "",
		red = "",
		singleAnswer = "",
		qcamel = "";

	function camelCase(str) {
		str = str.replace(/^[^a-z]+/ig, " ");
		str = " " + str.trim();
		let g = str.match(/\s\S/ig);
		for (var i = 0; i < g.length; i++) {
			str = str.replace(g[i], g[i].trim().toUpperCase());
		}
		str = str.replace(/[^a-zA-Z0-9]+/ig, '');
		str = str.charAt(0).toLocaleLowerCase() + str.slice(1);
		return (str);
	}

	function camelQuestion(q) {
		q = camelCase(q);
		q = q.replace(/NOTE|HEADLINE|CHECKBOX|CHECKED|TEXTAREA/, "");
		q = q.replace(/\{[^\}]+\}/, "");
		q = q.replace(/\[[^\]]+\]/, "");
		q = q.replace(/[^a-zA-Z0-9]+/ig, '');
		q = q.substring(0, 30);
		return (q);
	}
	payload = payload.trim();
	payload = payload.replace(/\r\n/ig, "\n", payload);
	payload = payload.replace(/\n\s+/ig, "\n", payload);
	payloadSimple = payload;
	//console.log(payloadSimple);
	var arr = payload.split("\n");
	for (i = 0; i < arr.length; i++) {
		required = "";
		NOTE = "";
		HEADLINE = "";
		TEXTAREA = "";
		CHECKBOX = "";
		CHECKED = "";
		red = "";
		singleAnswer = "";
		qcamel = "";
		iinc = i + 1;
		qcamel = "Q" + iinc + camelQuestion(arr[i]);


		if (arr[i].match(/ACTION/)) {
			var formAction = arr[i].replace(/ACTION/, "").trim();
			t += `\n<div id="formAction" style="display:none">${formAction}</div>\n\n`;
			continue;
		}
		if (arr[i].match(/METHOD/)) {
			var formMethod = arr[i].replace(/METHOD/, "").trim();
			t += `\n<div id="formMethod" style="display:none">${formMethod}</div>\n\n`;
			continue;
		}
		// double brackets for radio buttons
		if (arr[i].match(/\{\{/)) {
			//console.log ("matched {{ in question "+i);
			var pieces = arr[i].split(/\{\{/);
			var q = pieces[0];
			var ans = pieces[1];
			var answers = ans.split(/,/);

			for (var io = 0; io < answers.length; io++) {
				singleAnswer = answers[io].trim();
				singleAnswer = singleAnswer.replace(/\}|{+/g, "");
				red += `<input type="radio" name="${qcamel}" value="${singleAnswer}">${singleAnswer}<br>\n`;
			}
			var out = arr[i].replace(/\{\{[^\}]+\}\}/, "");
			t += `${out.trim()}<br>\n${red}<br>\n`;
			continue;
		}
		
		
		

		if (arr[i].match(/\{/)) {
			//console.log ("matched { in question "+i);
			var pieces = arr[i].split(/\{/);
			var q = pieces[0];
			var ans = pieces[1];
			var answers = ans.split(/,/);
			//console.log(`Q: ${q}, answers: ${answers}`);
			for (var io = 0; io < answers.length; io++) {
				singleAnswer = answers[io].trim();
				singleAnswer = singleAnswer.replace(/\}/, "");
				singleAnswer = singleAnswer.replace(/\{/, "");
				red += `<option value="${singleAnswer}" >${singleAnswer}</option>\n`;
			}
			var out = arr[i].replace(/\{[^\}]+\}/, "");
			t += `${out.trim()}<br>\n<select name="${qcamel}" style="margin-bottom:10px;">\n${red}</select><br>\n`;
			continue;
		}
		if (arr[i].match(/\[/)) {
			// this one is a bit tricky
			// we need to have a way to pass the question responses as an array to the form handler
			// not all backend platforms behave the same way
			// in this implementation we will use the name[]=value method
			// make sure your backend platfom has a way to parse this array syntax
			// or implement your own by adjusting the line uner "array syntax below" comment
			//console.log ("matched [ in question "+i);
			var pieces = arr[i].split(/\[/);
			var q = pieces[0];
			var ans = pieces[1];
			var answers = ans.split(/,/);
			//console.log(`Q: ${q}, answers: ${answers}`);

			for (var io = 0; io < answers.length; io++) {
				singleAnswer = answers[io].trim();
				singleAnswer = singleAnswer.replace(/\]/, "");
				var singleQ = camelQuestion(singleAnswer);
				singleAnswer = singleAnswer.replace(/\{/, "");
				// array syntax below
				red += `<input type="checkbox" value="${singleAnswer}" name="${qcamel}[]">${singleAnswer}<br>\n`;
			}
			var out = arr[i].replace(/\[[^\]]+\]/, "");
			t += `${out.trim()}<br>\n${red}<br>\n`;
			continue;
		}
		if (arr[i].match(/\*/)) {
			//console.log ("matched * in question "+i);
			required = "required";
		}
		if (arr[i].match(/NOTE/)) {
			//console.log ("matched NOTE in question "+i);
			var out = arr[i].replace(/NOTE/, "");
			t += `<div style="margin-bottom:10px;"><em>${out.trim()}</em></div><br>\n`;
			continue;
		}
		if (arr[i].match(/HEADLINE/)) {
			//console.log ("matched HEADLINE in question "+i);
			var out = arr[i].replace(/HEADLINE/, "");
			t += `<h2 style="margin-bottom:0px;">${out.trim()}</h2><br>\n`;
			continue;
		}
		if (arr[i].match(/TEXTAREA/)) {
			var out = arr[i].replace(/TEXTAREA/, "");
			t += `${out.trim()}<br>\n<textarea id="${qcamel}" name="${qcamel}" style="margin-bottom:10px;"></textarea><br>\n`;
			continue;
		}
		if (arr[i].match(/FILE/)) {
			var out = arr[i].replace(/FILE/, "");
			t += `${out.trim()}<br>\n<input type="file" id="${qcamel}" name="${qcamel}" style="margin-bottom:10px;"><br>\n`;
			continue;
		}
		if (arr[i].match(/CHECKBOX|CHECKED/)) {
			var out = arr[i].replace(/CHECKBOX/, "");
			if (arr[i].match(/CHECKED/)) {
				CHECKED = "CHECKED";
				out = out.replace(/CHECKED/, "");
			}
			t += `<input id="${qcamel}" name="${qcamel}"  type="checkbox" ${CHECKED} value="1" style="margin-bottom:10px;"> ${out.trim()}\n<br>\n`;
			continue;
		}
		t += arr[i] + `<br>\n<input type="text" id="${qcamel}" name="${qcamel}" ${required} style="margin-bottom:10px;"><br>\n\n`;
	}
	return (t);
}