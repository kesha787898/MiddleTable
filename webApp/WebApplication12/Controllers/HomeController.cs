using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Nethereum.ABI.FunctionEncoding.Attributes;
using Nethereum.Contracts;
using Nethereum.Hex.HexTypes;
using Nethereum.Web3;
using WebApplication12.Models;

namespace WebApplication12.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration configuration;

        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            this.configuration = configuration;
        }

        public async Task<IActionResult> Index()
        {
            this.ViewBag.Contract = this.configuration["ContractAddress"];
            return this.View();
        }

        public async Task<IActionResult> IsOn(string key)
        {
            var web3 = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
            var balance = await web3.Eth.GetBalance.SendRequestAsync(this.configuration["ContractAddress"]);
            Console.WriteLine($"Balance in Wei: {balance.Value}");

            var etherAmount = Web3.Convert.FromWei(balance.Value);
            Console.WriteLine($"Balance in Ether: {etherAmount}");
            
            Contract contract = web3.Eth.GetContract(this.configuration["Abi"], this.configuration["ContractAddress"]);
            Function isOnFunction = contract.GetFunction("IsOn");

            bool isOn = await isOnFunction.CallAsync<bool>(key);

            return this.Json(isOn);
        }

        public async Task<IActionResult> Balance()
        {
            var web3 = new Web3("https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
            var balance = await web3.Eth.GetBalance.SendRequestAsync(this.configuration["ContractAddress"]);

            return this.Json(balance.Value);
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
