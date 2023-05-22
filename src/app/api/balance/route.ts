async function checkBilling(apiKey: string) {
  if (apiKey == "") {
    return new Response("API Key is empty.");
  }

  // 计算起始日期和结束日期
  const now = new Date();
  const startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const endDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // 设置API请求URL和请求头
  const urlSubscription: string =
    "https://api.openai.com/v1/dashboard/billing/subscription"; // 查是否订阅
  const urlUsage = `https://api.openai.com/v1/dashboard/billing/usage?start_date=${formatDate(
    startDate
  )}&end_date=${formatDate(endDate)}`; // 查使用量
  const headers = {
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
  };

  try {
    // 获取API限额
    let response = await fetch(urlSubscription, { headers });
    if (!response.ok) {
      return new Response(
        JSON.stringify({ status: "error", message: response.statusText })
      );
    }
    const subscriptionData = await response.json();
    const totalAmount = subscriptionData.hard_limit_usd;

    // 获取已使用量
    response = await fetch(urlUsage, { headers });
    const usageData = await response.json();
    const totalUsage = usageData.total_usage / 100;

    // 计算剩余额度
    const remaining = totalAmount - totalUsage;

    // // 输出总用量、总额及余额信息
    // console.log(`Total Amount: ${totalAmount.toFixed(2)}`);
    // console.log(`Used: ${totalUsage.toFixed(2)}`);
    // console.log(`Remaining: ${remaining.toFixed(2)}`);

    return new Response(
      JSON.stringify({
        status: "success",
        total_granted: totalAmount,
        message: "查询成功",
        total_used: totalUsage,
        total_available: remaining,
      })
    );
  } catch (e: any) {
    return new Response(
      JSON.stringify({ status: "error", message: e.message })
    );
  }
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = body.apiKey || process.env.API_KEY;
    return checkBilling(apiKey ?? "");
  } catch (error) {
    return new Response(
      ["```json\n", JSON.stringify(error, null, "  "), "\n```"].join("")
    );
  }
}
