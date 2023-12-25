﻿using System.Collections.Specialized;
using System.IO;
using System.Runtime.CompilerServices;
using System.Web;

namespace ExternalPoliceComputer {
    public static class Functions {

        [MethodImpl(MethodImplOptions.NoInlining)]
        public static void SendMessage(string message) {
            if (Main.UseCI && File.ReadAllText($"{Main.DataPath}/callout.data").Length > 0) {

                NameValueCollection calloutData = HttpUtility.ParseQueryString(File.ReadAllText($"{Main.DataPath}/callout.data"));

                Main.UpdateCalloutData("additionalMessage", calloutData["additionalMessage"] + message + "\\n");
            }
        }
    }
}
