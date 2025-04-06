import asyncio

from mcp.client.session import ClientSession
from mcp.client.stdio import StdioServerParameters, stdio_client
from mcp.types import AnyUrl


async def main():
    async with stdio_client(
        StdioServerParameters(command="uv", args=["run", "stockanalyst_mcp_tool"])
    ) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()

            # # List available resources
            # resources = await session.list_resources()
            # print("2.",resources)

            # List available tools
            tools = await session.list_tools()
            print("3.",tools)

            # 2. Test calculate_rsi
            try:
                test_symbol = "META"  # Example symbol for testing
                print(f"\nTesting trade_recommendation for {test_symbol}...")
                result_obj = await session.call_tool(
                    "trade_recommendation", {"symbol": test_symbol}
                )
                print("Recommendation:")
                print(result_obj)
                # Check if the result is a dictionary and contains "result"
                # rsi_result = rsi_result_obj["result"]
                # print("RSI Result:")
                # if isinstance(rsi_result, dict) and "analysis" in rsi_result:
                #     print(rsi_result["analysis"])
                # else:
                #     print(rsi_result)
            except Exception as e:
                print(f"Unexpected error during calculate_rsi test: {e}")

            ## Get a specific resource
            # try:
            #     print("\nFetching resource...")
            #     resource = await session.read_resource(
            #         AnyUrl("file:///greeting.txt")
            #     )
            #     print("4.",resource)
            # except Exception as e:
            #     print(f"Unexpected error reading resource {e}")

            ## Get the prompt with arguments
            # List available prompts
            # prompts = await session.list_prompts()
            # print("1.",prompts)            
            # try:
            #     prompt = await session.get_prompt(
            #         "compare_tickers",
            #         {
            #             "symbol": "AAPL"
            #         },
            #     )
            #     print("\n5.",prompt)
            # except Exception as e:
            #     print(f"Unexpected error getting prompt {e}")            

asyncio.run(main())
