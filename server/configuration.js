module.exports = {
        "queries": {
                    "history" : {
                                    "Q-A01-clustersByRole" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id,role
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id,role
                                                        )
                                                        SELECT 
                                                            time,
                                                            role, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,role
                                                        ORDER BY 
                                                            time desc
                                                        `, 
                                    "Q-A02-clustersByInstanceType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id,instance_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id,instance_type
                                                        )
                                                        SELECT 
                                                            time,
                                                            instance_type, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,instance_type
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A03-clustersByInstanceMarket" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id,market_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id,market_type
                                                        )
                                                        SELECT 
                                                            time,
                                                            market_type, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,market_type
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A04-totalCPUs" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, instance_id, total_vcpu
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, instance_id, total_vcpu
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(cast (total_vcpu as bigint)) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A05-totalMemory" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, instance_id, round(total/1024/1024/1024) as total
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, instance_id, round(total/1024/1024/1024)
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(total) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `, 
                                    "Q-A06-totalCores" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, coresTotal
                                                            FROM emrdb.hadoop
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, coresTotal
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(coresTotal) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A07-totalJobsRunning" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, AVG(appsRunning) appsRunning
                                                            FROM emrdb.hadoop
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(appsRunning) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `, 
                                    "Q-A08-cpuUsage" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, instance_id, AVG(100-usage_idle) as cpu_usage
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, instance_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            AVG(cpu_usage) as cpu_avg,
                                                            MAX(cpu_usage) as cpu_max,
                                                            MIN(cpu_usage) as cpu_min,
                                                            APPROX_PERCENTILE(cpu_usage,0.1) as cpu_p10,
                                                            APPROX_PERCENTILE(cpu_usage,0.5) as cpu_p50,
                                                            APPROX_PERCENTILE(cpu_usage,0.9) as cpu_p90
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A09-MemoryUsage" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id, AVG(used_percent) as memory_usage
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            AVG(memory_usage) as memory_avg,
                                                            MAX(memory_usage) as memory_max,
                                                            MIN(memory_usage) as memory_min,
                                                            APPROX_PERCENTILE(memory_usage,0.1) as memory_p10,
                                                            APPROX_PERCENTILE(memory_usage,0.5) as memory_p50,
                                                            APPROX_PERCENTILE(memory_usage,0.9) as memory_p90
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A10-coreUsage" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id, AVG(coresUsage) as core_usage
                                                            FROM emrdb.hadoop
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, instance_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            AVG(core_usage) as cores_avg,
                                                            MAX(core_usage) as cores_max,
                                                            MIN(core_usage) as cores_min,
                                                            APPROX_PERCENTILE(core_usage,0.1) as cores_p10,
                                                            APPROX_PERCENTILE(core_usage,0.5) as cores_p50,
                                                            APPROX_PERCENTILE(core_usage,0.9) as cores_p90
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-A11-summaryClusters" : 
                                                        `
                                                        WITH vw_cluster_total_l1 AS (
                                                          SELECT cluster_id
                                                          FROM emrdb.cpu
                                                          WHERE {filter}
                                                          GROUP BY cluster_id
                                                        ),
                                                        vw_cluster_total AS (
                                                          SELECT 'cursor' as label, count(*) as total
                                                          FROM vw_cluster_total_l1
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_cpu_l1 AS (
                                                          SELECT cluster_id, instance_id,cast(total_vcpu as bigint) as vcpu
                                                          FROM emrdb.cpu
                                                          WHERE {filter}
                                                          GROUP BY 1,2,3
                                                        ),
                                                        vw_cluster_cpu AS (
                                                          SELECT 'cursor' as label, sum(vcpu) as total
                                                          FROM vw_cluster_cpu_l1  
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_memory_l1 AS (
                                                          SELECT cluster_id,instance_id,round(total/1024/1024/1024) as total
                                                          FROM emrdb.memory
                                                          WHERE {filter}
                                                          GROUP BY 1,2,3
                                                        ),
                                                        vw_cluster_memory AS (
                                                          SELECT 'cursor' as label, sum(total) as total
                                                          FROM vw_cluster_memory_l1  
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_nodes_l1 AS (
                                                          SELECT cluster_id, instance_id
                                                          FROM emrdb.cpu
                                                          WHERE {filter}
                                                          GROUP BY 1,2
                                                        ),
                                                        vw_cluster_nodes AS (
                                                          SELECT 'cursor' as label, count(*) as total
                                                          FROM vw_cluster_nodes_l1  
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_cpu_usage AS (
                                                            SELECT 
                                                            'cursor' as label,
                                                            AVG(100-usage_idle) as cpu_usage_avg,
                                                            MAX(100-usage_idle) as cpu_usage_max,
                                                            MIN(100-usage_idle) as cpu_usage_min,
                                                            APPROX_PERCENTILE(100-usage_idle,0.1) as cpu_usage_p10,
                                                            APPROX_PERCENTILE(100-usage_idle,0.5) as cpu_usage_p50,
                                                            APPROX_PERCENTILE(100-usage_idle,0.9) as cpu_usage_p90
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY 1
                                                        ),
                                                        vw_cluster_memory_usage AS (
                                                            SELECT 
                                                            'cursor' as label,
                                                            AVG(used_percent) as memory_usage_avg,
                                                            APPROX_PERCENTILE(used_percent,0.1) as memory_usage_p10,
                                                            APPROX_PERCENTILE(used_percent,0.5) as memory_usage_p50,
                                                            APPROX_PERCENTILE(used_percent,0.9) as memory_usage_p90
                                                            FROM 
                                                                emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY 1
                                                        )
                                                        SELECT 
                                                            a.total as total_clusters,
                                                            b.total as total_vcpu,
                                                            c.total as total_memory,
                                                            d.total as total_nodes,
                                                            e.cpu_usage_avg,
                                                            e.cpu_usage_max,
                                                            e.cpu_usage_min,
                                                            e.cpu_usage_p10,
                                                            e.cpu_usage_p50,
                                                            e.cpu_usage_p90,
                                                            f.memory_usage_avg,
                                                            f.memory_usage_p10,
                                                            f.memory_usage_p50,
                                                            f.memory_usage_p90
                                                        FROM 
                                                            vw_cluster_total a,
                                                            vw_cluster_cpu b,
                                                            vw_cluster_memory c,
                                                            vw_cluster_nodes d,
                                                            vw_cluster_cpu_usage e,
                                                            vw_cluster_memory_usage f
                                                        WHERE 
                                                            a.label = b.label
                                                            AND
                                                            a.label = c.label
                                                            AND
                                                            a.label = d.label
                                                            AND
                                                            a.label = e.label
                                                            AND
                                                            a.label = f.label
                                                        `,
                                        "Q-A12-summaryByInstanceType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT cluster_id,instance_id,instance_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id,instance_id,instance_type
                                                        )
                                                        SELECT instance_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY instance_type
                                                        ORDER BY instance_type desc
                                                        `,
                                        "Q-A13-summaryByInstanceMarket" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT cluster_id,instance_id,market_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id,instance_id,market_type
                                                        )
                                                        SELECT market_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY market_type
                                                        ORDER BY market_type desc
                                                        `,
                                        "Q-A14-summaryByInstanceRole" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT cluster_id,instance_id,role
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id,instance_id,role
                                                        )
                                                        SELECT role, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY role
                                                        ORDER BY role desc
                                                        `,
                                        "Q-A15-summaryNodesTable" : 
                                                        `
                                                        WITH vw_cpu AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    instance_id, 
                                                                    instance_type, 
                                                                    market_type, 
                                                                    cast(total_vcpu as bigint) as cpu_total,
                                                                    AVG(100-usage_idle) as cpu_usage_avg,
                                                                    APPROX_PERCENTILE(100-usage_idle,0.1) as cpu_usage_p10,
                                                                    APPROX_PERCENTILE(100-usage_idle,0.5) as cpu_usage_p50,
                                                                    APPROX_PERCENTILE(100-usage_idle,0.9) as cpu_usage_p90
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY 1,2,3,4,5
                                                        ),
                                                        vw_memory AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    instance_id, 
                                                                    instance_type, 
                                                                    market_type, 
                                                                    total as memory_total,
                                                                    AVG(used_percent) as memory_usage_avg,
                                                                    APPROX_PERCENTILE(used_percent,0.1) as memory_usage_p10,
                                                                    APPROX_PERCENTILE(used_percent,0.5) as memory_usage_p50,
                                                                    APPROX_PERCENTILE(used_percent,0.9) as memory_usage_p90
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY 1,2,3,4,5
                                                        )
                                                        SELECT  
                                                            a.cluster_id,
                                                            a.instance_id, 
                                                            a.instance_type, 
                                                            a.market_type, 
                                                            a.cpu_total,
                                                            a.cpu_usage_avg,
                                                            a.cpu_usage_p10,
                                                            a.cpu_usage_p50,
                                                            a.cpu_usage_p90,
                                                            b.memory_total,
                                                            b.memory_usage_avg,
                                                            b.memory_usage_p10,
                                                            b.memory_usage_p50,
                                                            b.memory_usage_p90
                                                        FROM vw_cpu a, vw_memory b
                                                        WHERE
                                                            a.instance_id = b.instance_id
                                                        ORDER BY a.instance_id desc
                                                        `,
                    
                    },
                    "global" : {
                                    "Q-B01-clustersByRole" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id,role
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id,role
                                                        )
                                                        SELECT 
                                                            time,
                                                            role, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,role
                                                        ORDER BY 
                                                            time desc
                                                        `, 
                                    "Q-B02-clustersByInstanceType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id,instance_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id,instance_type
                                                        )
                                                        SELECT 
                                                            time,
                                                            instance_type, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,instance_type
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B03-clustersByInstanceMarket" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id,instance_id,market_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id,instance_id,market_type
                                                        )
                                                        SELECT 
                                                            time,
                                                            market_type, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,market_type
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B04-totalClusters" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B05-totalCPUs" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, instance_id, total_vcpu
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, instance_id, total_vcpu
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(cast (total_vcpu as bigint)) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B06-totalMemory" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, instance_id, round(total/1024/1024/1024) as total
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, instance_id, round(total/1024/1024/1024)
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(total) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `, 
                                    "Q-B07-totalCores" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, coresTotal
                                                            FROM emrdb.hadoop
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id, coresTotal
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(coresTotal) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B08-totalJobsRunning" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, AVG(appsRunning) appsRunning
                                                            FROM emrdb.hadoop
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            sum(appsRunning) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `, 
                                    "Q-B09-cpuUsage" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, AVG(100-usage_idle) as cpu_usage
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            AVG(cpu_usage) as cpu_avg,
                                                            MAX(cpu_usage) as cpu_max,
                                                            MIN(cpu_usage) as cpu_min,
                                                            APPROX_PERCENTILE(cpu_usage,0.1) as cpu_p10,
                                                            APPROX_PERCENTILE(cpu_usage,0.5) as cpu_p50,
                                                            APPROX_PERCENTILE(cpu_usage,0.9) as cpu_p90
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B10-MemoryUsage" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, AVG(used_percent) as memory_usage
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            AVG(memory_usage) as memory_avg,
                                                            MAX(memory_usage) as memory_max,
                                                            MIN(memory_usage) as memory_min,
                                                            APPROX_PERCENTILE(memory_usage,0.1) as memory_p10,
                                                            APPROX_PERCENTILE(memory_usage,0.5) as memory_p50,
                                                            APPROX_PERCENTILE(memory_usage,0.9) as memory_p90
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B11-coreUsage" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,{period}) as time,cluster_id, AVG(coresUsage) as core_usage
                                                            FROM emrdb.hadoop
                                                            WHERE {filter}
                                                            GROUP BY BIN(time,{period}),cluster_id
                                                        )
                                                        SELECT 
                                                            time,
                                                            AVG(core_usage) as cores_avg,
                                                            MAX(core_usage) as cores_max,
                                                            MIN(core_usage) as cores_min,
                                                            APPROX_PERCENTILE(core_usage,0.1) as cores_p10,
                                                            APPROX_PERCENTILE(core_usage,0.5) as cores_p50,
                                                            APPROX_PERCENTILE(core_usage,0.9) as cores_p90
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time
                                                        ORDER BY 
                                                            time desc
                                                        `,
                                    "Q-B12-clusterLifeCycle" : 
                                                        `
                                                        SELECT 
                                                            cluster_id, 
                                                            MIN(time) as time_min, 
                                                            MAX(time) as time_max
                                                        FROM 
                                                            emrdb.cpu
                                                        WHERE {filter} 
                                                        GROUP BY 
                                                            cluster_id
                                                        ORDER BY 2 DESC, 3 DESC
                                                                
                                                        `,
                                    "Q-B13-summaryClusters" : 
                                                        `
                                                        WITH vw_cluster_total_l1 AS (
                                                          SELECT cluster_id
                                                          FROM emrdb.cpu
                                                          WHERE {filter}
                                                          GROUP BY cluster_id
                                                        ),
                                                        vw_cluster_total AS (
                                                          SELECT 'cursor' as label, count(*) as total
                                                          FROM vw_cluster_total_l1
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_cpu_l1 AS (
                                                          SELECT cluster_id, instance_id,cast(total_vcpu as bigint) as vcpu
                                                          FROM emrdb.cpu
                                                          WHERE {filter}
                                                          GROUP BY 1,2,3
                                                        ),
                                                        vw_cluster_cpu AS (
                                                          SELECT 'cursor' as label, sum(vcpu) as total
                                                          FROM vw_cluster_cpu_l1  
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_memory_l1 AS (
                                                          SELECT cluster_id,instance_id,round(total/1024/1024/1024) as total
                                                          FROM emrdb.memory
                                                          WHERE {filter}
                                                          GROUP BY 1,2,3
                                                        ),
                                                        vw_cluster_memory AS (
                                                          SELECT 'cursor' as label, sum(total) as total
                                                          FROM vw_cluster_memory_l1  
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_nodes_l1 AS (
                                                          SELECT cluster_id, instance_id
                                                          FROM emrdb.cpu
                                                          WHERE {filter}
                                                          GROUP BY 1,2
                                                        ),
                                                        vw_cluster_nodes AS (
                                                          SELECT 'cursor' as label, count(*) as total
                                                          FROM vw_cluster_nodes_l1  
                                                          GROUP BY 1
                                                        ),
                                                        vw_cluster_cpu_usage AS (
                                                            SELECT 
                                                            'cursor' as label,
                                                            AVG(100-usage_idle) as cpu_usage_avg,
                                                            MAX(100-usage_idle) as cpu_usage_max,
                                                            MIN(100-usage_idle) as cpu_usage_min,
                                                            APPROX_PERCENTILE(100-usage_idle,0.1) as cpu_usage_p10,
                                                            APPROX_PERCENTILE(100-usage_idle,0.5) as cpu_usage_p50,
                                                            APPROX_PERCENTILE(100-usage_idle,0.9) as cpu_usage_p90
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY 1
                                                        ),
                                                        vw_cluster_memory_usage AS (
                                                            SELECT 
                                                            'cursor' as label,
                                                            AVG(used_percent) as memory_usage_avg,
                                                            APPROX_PERCENTILE(used_percent,0.1) as memory_usage_p10,
                                                            APPROX_PERCENTILE(used_percent,0.5) as memory_usage_p50,
                                                            APPROX_PERCENTILE(used_percent,0.9) as memory_usage_p90
                                                            FROM 
                                                                emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY 1
                                                        )
                                                        SELECT 
                                                            a.total as total_clusters,
                                                            b.total as total_vcpu,
                                                            c.total as total_memory,
                                                            d.total as total_nodes,
                                                            e.cpu_usage_avg,
                                                            e.cpu_usage_max,
                                                            e.cpu_usage_min,
                                                            e.cpu_usage_p10,
                                                            e.cpu_usage_p50,
                                                            e.cpu_usage_p90,
                                                            f.memory_usage_avg,
                                                            f.memory_usage_p10,
                                                            f.memory_usage_p50,
                                                            f.memory_usage_p90
                                                        FROM 
                                                            vw_cluster_total a,
                                                            vw_cluster_cpu b,
                                                            vw_cluster_memory c,
                                                            vw_cluster_nodes d,
                                                            vw_cluster_cpu_usage e,
                                                            vw_cluster_memory_usage f
                                                        WHERE 
                                                            a.label = b.label
                                                            AND
                                                            a.label = c.label
                                                            AND
                                                            a.label = d.label
                                                            AND
                                                            a.label = e.label
                                                            AND
                                                            a.label = f.label
                                                        `,
                                        "Q-B14-summaryByInstanceType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT cluster_id,instance_id,instance_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id,instance_id,instance_type
                                                        )
                                                        SELECT instance_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY instance_type
                                                        ORDER BY instance_type desc
                                                        `,
                                        "Q-B15-summaryByInstanceMarket" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT cluster_id,instance_id,market_type
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id,instance_id,market_type
                                                        )
                                                        SELECT market_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY market_type
                                                        ORDER BY market_type desc
                                                        `,
                                        "Q-B16-summaryByInstanceRole" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT cluster_id,instance_id,role
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id,instance_id,role
                                                        )
                                                        SELECT role, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY role
                                                        ORDER BY role desc
                                                        `,
                                        "Q-B17-summaryClusterTable" : 
                                                        `
                                                        WITH vw_cpu_level_1 AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    instance_id, 
                                                                    instance_type, 
                                                                    market_type, 
                                                                    cast(total_vcpu as bigint) as cpu_total
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY 1,2,3,4,5
                                                        ),
                                                        vw_cpu_level_2 AS (
                                                            SELECT 
                                                                    cluster_id, 
                                                                    COUNT(*) as nodes_total,
                                                                    SUM(cpu_total) as cpu_total
                                                            FROM vw_cpu_level_1
                                                            GROUP BY cluster_id
                                                        ),
                                                        vw_cpu_level_3 AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    AVG(100-usage_idle) as cpu_usage_avg,
                                                                    APPROX_PERCENTILE(100-usage_idle,0.1) as cpu_usage_p10,
                                                                    APPROX_PERCENTILE(100-usage_idle,0.5) as cpu_usage_p50,
                                                                    APPROX_PERCENTILE(100-usage_idle,0.9) as cpu_usage_p90
                                                            FROM emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id
                                                        ),
                                                        vw_cpu AS (
                                                            SELECT 
                                                                    a.cluster_id,
                                                                    a.nodes_total,
                                                                    a.cpu_total,
                                                                    b.cpu_usage_avg,
                                                                    b.cpu_usage_p10,
                                                                    b.cpu_usage_p50,
                                                                    b.cpu_usage_p90
                                                            FROM vw_cpu_level_2 a, vw_cpu_level_3 b
                                                            WHERE 
                                                                a.cluster_id = b.cluster_id
                                                        ),
                                                        vw_memory_level_1 AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    instance_id, 
                                                                    instance_type, 
                                                                    market_type, 
                                                                    total as memory_total
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY 1,2,3,4,5
                                                        ),
                                                        vw_memory_level_2 AS (
                                                            SELECT 
                                                                    cluster_id, 
                                                                    SUM(memory_total) as memory_total
                                                            FROM vw_memory_level_1
                                                            GROUP BY cluster_id
                                                        ),
                                                        vw_memory_level_3 AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    AVG(used_percent) as memory_usage_avg,
                                                                    APPROX_PERCENTILE(used_percent,0.1) as memory_usage_p10,
                                                                    APPROX_PERCENTILE(used_percent,0.5) as memory_usage_p50,
                                                                    APPROX_PERCENTILE(used_percent,0.9) as memory_usage_p90
                                                            FROM emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY cluster_id
                                                        ),
                                                        vw_memory AS (
                                                            SELECT 
                                                                    a.cluster_id,
                                                                    a.memory_total,
                                                                    b.memory_usage_avg,
                                                                    b.memory_usage_p10,
                                                                    b.memory_usage_p50,
                                                                    b.memory_usage_p90
                                                            FROM vw_memory_level_2 a, vw_memory_level_3 b
                                                            WHERE 
                                                                a.cluster_id = b.cluster_id
                                                        )
                                                        SELECT  
                                                            a.cluster_id,
                                                            a.nodes_total,
                                                            a.cpu_total,
                                                            a.cpu_usage_avg,
                                                            a.cpu_usage_p10,
                                                            a.cpu_usage_p50,
                                                            a.cpu_usage_p90,
                                                            b.memory_total,
                                                            b.memory_usage_avg,
                                                            b.memory_usage_p10,
                                                            b.memory_usage_p50,
                                                            b.memory_usage_p90
                                                        FROM vw_cpu a, vw_memory b
                                                        WHERE
                                                            a.cluster_id = b.cluster_id
                                                        ORDER BY a.cluster_id desc
                                                        `,
                                        "Q-B18-clustersTotalTime" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT 
                                                                cluster_id, 
                                                                EXTRACT(HOUR FROM (MAX(time) - MIN(time))) + 
                                                                ( EXTRACT(DAY FROM (MAX(time) - MIN(time))) * 24 ) as total_hours
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY cluster_id

                                                        )
                                                        SELECT 
                                                            SUM(total_hours) as total_hours
                                                        FROM 
                                                            vw_nodes
                                                        `,
                                        
                    },
                    "cluster" : {
                                    "Q-C01-nodesSummary" :  `
                                                        WITH vw_cpu AS (
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total_vcpu, MAX(time) as time, cast('100' as int) - MAX_BY(usage_idle, time) as cpu_usage
                                                            FROM emrdb.cpu
                                                            WHERE time between ago(5m) and now() and cluster_id = '{cluster_id}'
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total_vcpu
                                                        ),
                                                        vw_memory AS(
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total as total_memory, MAX(time) as time, MAX_BY(used_percent, time) as memory_usage
                                                            FROM emrdb.memory
                                                            WHERE time between ago(5m) and now() and cluster_id = '{cluster_id}'
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total
                                                        ), 
                                                        vw_disk_level_1 AS (
                                                            SELECT time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, SUM(read_bytes_rate) as read_bytes, SUM(write_bytes_rate) as write_bytes, SUM(reads_rate) as reads, SUM(writes_rate) as writes
                                                            FROM emrdb.disk
                                                            WHERE time between ago(5m) and now() and cluster_id = '{cluster_id}'
                                                            group by time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        ),
                                                        vw_disk AS (
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, MAX(time) as time, MAX_BY(read_bytes, time) as read_bytes, MAX_BY(write_bytes, time) as write_bytes, MAX_BY(reads, time) as io_reads, MAX_BY(writes, time) as io_writes
                                                            FROM vw_disk_level_1
                                                            WHERE time between ago(5m) and now() and cluster_id = '{cluster_id}'
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        ),
                                                        vw_network_level_1 AS (
                                                            SELECT time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, SUM(bytes_sent_rate) as sent_bytes, SUM(bytes_recv_rate) as recv_bytes
                                                            FROM emrdb.network
                                                            WHERE time between ago(5m) and now() and cluster_id = '{cluster_id}'
                                                            group by time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        ),
                                                        vw_network AS (
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, MAX(time) as time, MAX_BY(sent_bytes, time) as sent_bytes, MAX_BY(recv_bytes, time) as recv_bytes
                                                            FROM vw_network_level_1
                                                            WHERE time between ago(5m) and now() and cluster_id = '{cluster_id}'
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        )
                                                        SELECT 
                                                        	vw_cpu.cluster_id, 
                                                            vw_cpu.group_id, 
                                                            vw_cpu.instance_type, 
                                                            vw_cpu.instance_id, 
                                                            vw_cpu.market_type, 
                                                            vw_cpu.role, 
                                                            vw_cpu.az, 
                                                            vw_cpu.private_ip,	
                                                            vw_cpu.total_vcpu,
                                                            vw_cpu.cpu_usage, 
                                                            vw_memory.memory_usage,
                                                            vw_memory.total_memory,
                                                            vw_disk.read_bytes,
                                                            vw_disk.write_bytes,
                                                            vw_disk.write_bytes + vw_disk.read_bytes as total_disk_bytes,
                                                            vw_disk.io_reads,
                                                            vw_disk.io_writes,
                                                            vw_disk.io_reads + vw_disk.io_writes as total_iops,
                                                            vw_network.sent_bytes,
                                                            vw_network.recv_bytes,
                                                            vw_network.sent_bytes + vw_network.recv_bytes as total_network_bytes
                                                        FROM 
                                                            vw_cpu, vw_memory, vw_disk, vw_network
                                                        WHERE
                                                            vw_cpu.cluster_id = vw_memory.cluster_id
                                                            and
                                                            vw_cpu.instance_id = vw_memory.instance_id
                                                            and
                                                            vw_cpu.cluster_id = vw_disk.cluster_id
                                                            and
                                                            vw_cpu.instance_id = vw_disk.instance_id
                                                            and
                                                            vw_cpu.cluster_id = vw_network.cluster_id
                                                            and
                                                            vw_cpu.instance_id = vw_network.instance_id
                                                        `,
                                    "Q-C02-nodesByRole" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,1m) as time,cluster_id,instance_id,role
                                                            FROM emrdb.cpu
                                                            WHERE time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY BIN(time,1m),cluster_id,instance_id,role
                                                        )
                                                        SELECT 
                                                            time,
                                                            role, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,role
                                                        ORDER BY 
                                                            role,time desc
                                                        `,
                                    "Q-C03-nodesByInstanceType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time, 1m ) as time,cluster_id,instance_id,instance_type
                                                            FROM emrdb.cpu
                                                            WHERE time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY BIN(time, 1m ),cluster_id,instance_id,instance_type
                                                        )
                                                        SELECT time,instance_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY time,instance_type
                                                        ORDER BY instance_type,time desc
                                                        `,
                                    "Q-C04-nodesByMarketType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time, 1m ) as time,cluster_id,instance_id,market_type
                                                            FROM emrdb.cpu
                                                            WHERE time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY BIN(time, 1m ),cluster_id,instance_id,market_type
                                                        )
                                                        SELECT time,market_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY time,market_type
                                                        ORDER BY market_type,time desc
                                                        `,
                                    "Q-C05-clusterHostSummary" : 
                                                        `
                                                        WITH vw_cpu AS (
                                                            SELECT 
                                                                cluster_id,
                                                                BIN(time, 10s ) as time,
                                                                AVG(100-usage_idle) as cpu_usage_avg, 
                                                                MAX(100-usage_idle) as cpu_usage_max, 
                                                                MIN(100-usage_idle) as cpu_usage_min
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE 
                                                                time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY 
                                                                cluster_id,BIN(time, 10s )
                                                        ),
                                                        vw_memory AS (
                                                            SELECT 
                                                                cluster_id,
                                                                BIN(time, 10s ) as time,
                                                                AVG(used_percent) as memory_usage_avg, 
                                                                MAX(used_percent) as memory_usage_max, 
                                                                MIN(used_percent) as memory_usage_min
                                                            FROM 
                                                                emrdb.memory
                                                            WHERE 
                                                                time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY 
                                                                cluster_id,BIN(time, 10s )
                                                        ),
                                                        vw_disk_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    cluster_id,
                                                                    instance_id,
                                                                    SUM(read_bytes_rate) as read_bytes,
                                                                    SUM(write_bytes_rate) as write_bytes, 
                                                                    SUM(reads_rate) as io_reads, 
                                                                    SUM(writes_rate) as io_writes
                                                            FROM 
                                                                    emrdb.disk
                                                            WHERE 
                                                                    time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY 
                                                                    time,
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_disk_level_2 AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    cluster_id,
                                                                    instance_id,
                                                                    AVG(read_bytes) as read_bytes,
                                                                    AVG(write_bytes) as write_bytes,
                                                                    AVG(io_reads) as io_reads,
                                                                    AVG(io_writes) as io_writes
                                                            FROM 
                                                                    vw_disk_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s ),
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_disk AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    BIN(time, 10s ) as time, 
                                                                    AVG(read_bytes) as read_bytes_avg,
                                                                    AVG(write_bytes) as write_bytes_avg, 
                                                                    AVG(io_reads) as io_reads_avg, 
                                                                    AVG(io_writes) as io_writes_avg,
                                                                    MAX(read_bytes) as read_bytes_max,
                                                                    MAX(write_bytes) as write_bytes_max, 
                                                                    MAX(io_reads) as io_reads_max, 
                                                                    MAX(io_writes) as io_writes_max,
                                                                    MIN(read_bytes) as read_bytes_min,
                                                                    MIN(write_bytes) as write_bytes_min, 
                                                                    MIN(io_reads) as io_reads_min, 
                                                                    MIN(io_writes) as io_writes_min,
                                                                    SUM(read_bytes) as read_bytes_sum,
                                                                    SUM(write_bytes) as write_bytes_sum, 
                                                                    SUM(io_reads) as io_reads_sum, 
                                                                    SUM(io_writes) as io_writes_sum
                                                            FROM 
                                                                    vw_disk_level_2
                                                            GROUP BY 
                                                                    cluster_id,BIN(time, 10s )
                                                        ),
                                                        vw_network_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    cluster_id,
                                                                    instance_id,
                                                                    SUM(bytes_sent_rate) as bytes_sent,
                                                                    SUM(bytes_recv_rate) as bytes_recv
                                                            FROM 
                                                                    emrdb.network
                                                            WHERE 
                                                                    time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY 
                                                                    time,
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_network_level_2 AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    cluster_id,
                                                                    instance_id,
                                                                    AVG(bytes_sent) as bytes_sent,
                                                                    AVG(bytes_recv) as bytes_recv
                                                            FROM 
                                                                    vw_network_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s ),
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_network AS (
                                                            SELECT 
                                                                    cluster_id,
                                                                    BIN(time, 10s ) as time,
                                                                    AVG(bytes_sent) as bytes_sent_avg,
                                                                    MAX(bytes_sent) as bytes_sent_max,
                                                                    MIN(bytes_sent) as bytes_sent_min,
                                                                    SUM(bytes_sent) as bytes_sent_sum,
                                                                    AVG(bytes_recv) as bytes_recv_avg,
                                                                    MAX(bytes_recv) as bytes_recv_max,
                                                                    MIN(bytes_recv) as bytes_recv_min, 
                                                                    SUM(bytes_recv) as bytes_recv_sum
                                                            FROM 
                                                                    vw_network_level_2
                                                            GROUP BY 
                                                                    cluster_id,BIN(time, 10s )
                                                        )
                                                        SELECT
                                                            vw_cpu.time,
                                                            vw_cpu.cpu_usage_avg,
                                                            vw_cpu.cpu_usage_max,
                                                            vw_cpu.cpu_usage_min,
                                                            vw_memory.memory_usage_avg,
                                                            vw_memory.memory_usage_max,
                                                            vw_memory.memory_usage_min,
                                                            vw_disk.read_bytes_sum as disk_bytes_reads,
                                                            vw_disk.write_bytes_sum as disk_bytes_writes,
                                                            (vw_disk.read_bytes_sum + vw_disk.write_bytes_sum) as disk_bytes,
                                                            (vw_disk.read_bytes_avg + vw_disk.write_bytes_avg) as disk_bytes_avg,
                                                            (vw_disk.read_bytes_max + vw_disk.write_bytes_max) as disk_bytes_max,
                                                            (vw_disk.read_bytes_min + vw_disk.write_bytes_min) as disk_bytes_min,
                                                            vw_disk.io_reads_sum as disk_io_reads,
                                                            vw_disk.io_writes_sum as disk_io_writes,
                                                            (vw_disk.io_writes_sum + vw_disk.io_reads_sum) as disk_iops,
                                                            (vw_disk.io_writes_avg + vw_disk.io_reads_avg) as disk_iops_avg,
                                                            (vw_disk.io_writes_max + vw_disk.io_reads_max) as disk_iops_max,
                                                            (vw_disk.io_writes_min + vw_disk.io_reads_min) as disk_iops_min,
                                                            vw_network.bytes_sent_sum as network_sent_bytes,
                                                            vw_network.bytes_recv_sum as network_recv_bytes,
                                                            (vw_network.bytes_sent_sum + vw_network.bytes_recv_sum) as network_bytes,
                                                            (vw_network.bytes_sent_avg + vw_network.bytes_recv_avg) as network_bytes_avg,
                                                            (vw_network.bytes_sent_max + vw_network.bytes_recv_max) as network_bytes_max,
                                                            (vw_network.bytes_sent_min + vw_network.bytes_recv_min) as network_bytes_min
                                                        FROM 
                                                            vw_cpu, vw_memory, vw_disk, vw_network
                                                        WHERE
                                                            vw_cpu.cluster_id = vw_memory.cluster_id
                                                            and
                                                            vw_cpu.time = vw_memory.time
                                                            and
                                                            vw_cpu.cluster_id = vw_disk.cluster_id
                                                            and
                                                            vw_cpu.time = vw_disk.time
                                                            and
                                                            vw_cpu.cluster_id = vw_network.cluster_id
                                                            and
                                                            vw_cpu.time = vw_network.time
                                                        ORDER BY 
                                                            vw_cpu.time
                                                        `,
                                    "Q-C06-clusterHadoopSummary" : 
                                                        `
                                                            SELECT 
                                                                cluster_id, 
                                                                MAX(time) as time,
                                                                MAX_BY(coresAvailable, time) as coresAvailable,
                                                                MAX_BY(coresAllocated, time) as coresAllocated,
                                                                MAX_BY(coresPending, time) as coresPending,
                                                                MAX_BY(coresTotal, time) as coresTotal,
                                                                MAX_BY(coresUsage, time) as coresUsage,
                                                                MAX_BY(coresReserved, time) as coresReserved,
                                                                MAX_BY(memoryAllocated, time) * 1024 * 1024 as memoryAllocated,
                                                                MAX_BY(memoryAvailable, time) * 1024 * 1024 as memoryAvailable,
                                                                MAX_BY(memoryPending, time) * 1024 * 1024 as memoryPending,
                                                                MAX_BY(memoryReserved, time) * 1024 * 1024 as memoryReserved,
                                                                MAX_BY(memoryTotal, time) * 1024 * 1024 as memoryTotal,
                                                                MAX_BY(memoryUsage, time)  as memoryUsage,
                                                                MAX_BY(appsCompleted, time) as appsCompleted,
                                                                MAX_BY(appsFailed, time) as appsFailed,
                                                                MAX_BY(appsKilled, time) as appsKilled,
                                                                MAX_BY(appsPending, time) as appsPending,
                                                                MAX_BY(appsRunning, time) as appsRunning,
                                                                MAX_BY(appsSubmitted, time) as appsSubmitted,
                                                                MAX_BY(containersAllocated, time) as containersAllocated,
                                                                MAX_BY(containersPending, time) as containersPending,
                                                                MAX_BY(containersReserved, time) as containersReserved,
                                                                MAX_BY(nodesDecommissioned, time) as nodesDecommissioned,
                                                                MAX_BY(nodesDecommissioning, time) as nodesDecommissioning,
                                                                MAX_BY(nodesActive, time) as nodesActive,
                                                                MAX_BY(nodesLost, time) as nodesLost,
                                                                MAX_BY(nodesRebooted, time) as nodesRebooted,
                                                                MAX_BY(nodesShutdown, time) as nodesShutdown,
                                                                MAX_BY(nodesTotal, time) as nodesTotal,
                                                                MAX_BY(nodesUnhealthy, time) as nodesUnhealthy
                                                            FROM 
                                                                emrdb.hadoop
                                                            WHERE 
                                                                time between ago({period}) and now() and cluster_id = '{cluster_id}'
                                                            GROUP BY 
                                                                cluster_id
                                                        `
                            },
                            "node" : {
                                    "Q-D01-metricsDetails" : 
                                                        `
                                                        WITH vw_cpu AS (
                                                            SELECT 
                                                                instance_id,
                                                                BIN(time, 10s ) as time,
                                                                AVG(100-usage_idle) as cpu_usage
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE 
                                                                time between ago({period}) and now() and cluster_id = '{cluster_id}' and instance_id = '{instance_id}'
                                                            GROUP BY 
                                                                instance_id,BIN(time, 10s )
                                                        ),
                                                        vw_memory AS (
                                                            SELECT 
                                                                instance_id,
                                                                BIN(time, 10s ) as time,
                                                                AVG(used_percent) as memory_usage
                                                            FROM 
                                                                emrdb.memory
                                                            WHERE 
                                                                time between ago({period}) and now() and cluster_id = '{cluster_id}' and instance_id = '{instance_id}'
                                                            GROUP BY 
                                                                instance_id,BIN(time, 10s )
                                                        ),
                                                        vw_disk_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    SUM(read_bytes_rate) as read_bytes,
                                                                    SUM(write_bytes_rate) as write_bytes, 
                                                                    SUM(reads_rate) as read_iops, 
                                                                    SUM(writes_rate) as write_iops
                                                            FROM 
                                                                    emrdb.disk
                                                            WHERE 
                                                                    time between ago({period}) and now() and cluster_id = '{cluster_id}' and instance_id = '{instance_id}'
                                                            GROUP BY 
                                                                    time
                                                        ),
                                                        vw_disk AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    AVG(read_bytes) as read_bytes,
                                                                    AVG(write_bytes) as write_bytes,
                                                                    AVG(read_iops) as read_iops,
                                                                    AVG(write_iops) as write_iops
                                                            FROM 
                                                                    vw_disk_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s )
                                                        ),
                                                        vw_network_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    SUM(bytes_sent_rate) as bytes_sent,
                                                                    SUM(bytes_recv_rate) as bytes_recv
                                                            FROM 
                                                                    emrdb.network
                                                            WHERE 
                                                                    time between ago({period}) and now() and cluster_id = '{cluster_id}' and instance_id = '{instance_id}'
                                                            GROUP BY 
                                                                    time
                                                        ),
                                                        vw_network AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    AVG(bytes_sent) as bytes_sent,
                                                                    AVG(bytes_recv) as bytes_recv
                                                            FROM 
                                                                    vw_network_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s )
                                                        )
                                                        SELECT
                                                            vw_cpu.time,
                                                            vw_cpu.cpu_usage,
                                                            vw_memory.memory_usage,
                                                            vw_disk.read_bytes as disk_read_bytes,
                                                            vw_disk.write_bytes as disk_write_bytes,
                                                            vw_disk.read_iops as disk_read_iops,
                                                            vw_disk.write_iops as disk_write_iops,
                                                            (vw_disk.write_bytes + vw_disk.read_bytes) as disk_bytes,
                                                            (vw_disk.write_iops + vw_disk.read_iops) as disk_iops,
                                                            vw_network.bytes_sent as network_sent,
                                                            vw_network.bytes_recv as network_recv,
                                                            (vw_network.bytes_sent + vw_network.bytes_recv) as network_bytes
                                                        FROM 
                                                            vw_cpu, vw_memory, vw_disk, vw_network
                                                        WHERE
                                                            vw_cpu.time = vw_memory.time
                                                            and
                                                            vw_cpu.time = vw_disk.time
                                                            and
                                                            vw_cpu.time = vw_network.time
                                                        ORDER BY 
                                                            vw_cpu.time
                                                        `
                            },
                            "global-live" : {
                                    "Q-E01-nodesSummary" :  `
                                                        WITH vw_cpu AS (
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total_vcpu, MAX(time) as time, cast('100' as int) - MAX_BY(usage_idle, time) as cpu_usage
                                                            FROM emrdb.cpu
                                                            WHERE time between ago(5m) and now() 
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total_vcpu
                                                        ),
                                                        vw_memory AS(
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total as total_memory, MAX(time) as time, MAX_BY(used_percent, time) as memory_usage
                                                            FROM emrdb.memory
                                                            WHERE time between ago(5m) and now() 
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, total
                                                        ), 
                                                        vw_disk_level_1 AS (
                                                            SELECT time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, SUM(read_bytes_rate) as read_bytes, SUM(write_bytes_rate) as write_bytes, SUM(reads_rate) as reads, SUM(writes_rate) as writes
                                                            FROM emrdb.disk
                                                            WHERE time between ago(5m) and now() 
                                                            group by time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        ),
                                                        vw_disk AS (
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, MAX(time) as time, MAX_BY(read_bytes, time) as read_bytes, MAX_BY(write_bytes, time) as write_bytes, MAX_BY(reads, time) as io_reads, MAX_BY(writes, time) as io_writes
                                                            FROM vw_disk_level_1
                                                            WHERE time between ago(5m) and now() 
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        ),
                                                        vw_network_level_1 AS (
                                                            SELECT time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, SUM(bytes_sent_rate) as sent_bytes, SUM(bytes_recv_rate) as recv_bytes
                                                            FROM emrdb.network
                                                            WHERE time between ago(5m) and now() 
                                                            group by time,cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        ),
                                                        vw_network AS (
                                                            SELECT cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip, MAX(time) as time, MAX_BY(sent_bytes, time) as sent_bytes, MAX_BY(recv_bytes, time) as recv_bytes
                                                            FROM vw_network_level_1
                                                            WHERE time between ago(5m) and now() 
                                                            group by cluster_id, group_id, instance_type, instance_id, market_type, role, az, private_ip
                                                        )
                                                        SELECT 
                                                        	vw_cpu.cluster_id, 
                                                            SUM(CAST(vw_cpu.total_vcpu AS BIGINT)) as total_vcpu ,
                                                            AVG(vw_cpu.cpu_usage) as cpu_usage, 
                                                            AVG(vw_memory.memory_usage) as memory_usage,
                                                            SUM(vw_memory.total_memory) as total_memory,
                                                            SUM(vw_disk.read_bytes) as read_bytes,
                                                            SUM(vw_disk.write_bytes) as write_bytes,
                                                            SUM(vw_disk.write_bytes + vw_disk.read_bytes) as total_disk_bytes,
                                                            SUM(vw_disk.io_reads) as io_reads,
                                                            SUM(vw_disk.io_writes) as io_writes,
                                                            SUM(vw_disk.io_reads + vw_disk.io_writes) as total_iops,
                                                            SUM(vw_network.sent_bytes) as sent_bytes,
                                                            SUM(vw_network.recv_bytes) as recv_bytes,
                                                            SUM(vw_network.sent_bytes + vw_network.recv_bytes) as total_network_bytes,
                                                            COUNT(*) as total_nodes
                                                        FROM 
                                                            vw_cpu, vw_memory, vw_disk, vw_network
                                                        WHERE
                                                            vw_cpu.cluster_id = vw_memory.cluster_id
                                                            and
                                                            vw_cpu.instance_id = vw_memory.instance_id
                                                            and
                                                            vw_cpu.cluster_id = vw_disk.cluster_id
                                                            and
                                                            vw_cpu.instance_id = vw_disk.instance_id
                                                            and
                                                            vw_cpu.cluster_id = vw_network.cluster_id
                                                            and
                                                            vw_cpu.instance_id = vw_network.instance_id
                                                        GROUP BY vw_cpu.cluster_id
                                                        ORDER BY vw_cpu.cluster_id
                                                        `,
                                    "Q-E02-nodesByRole" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time,1m) as time,cluster_id,instance_id,role
                                                            FROM emrdb.cpu
                                                            WHERE time between ago({period}) and now() 
                                                            GROUP BY BIN(time,1m),cluster_id,instance_id,role
                                                        )
                                                        SELECT 
                                                            time,
                                                            role, 
                                                            count(*) as total
                                                        FROM 
                                                            vw_nodes
                                                        GROUP BY 
                                                            time,role
                                                        ORDER BY 
                                                            role,time desc
                                                        `,
                                    "Q-E03-nodesByInstanceType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time, 1m ) as time,cluster_id,instance_id,instance_type
                                                            FROM emrdb.cpu
                                                            WHERE time between ago({period}) and now()
                                                            GROUP BY BIN(time, 1m ),cluster_id,instance_id,instance_type
                                                        )
                                                        SELECT time,instance_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY time,instance_type
                                                        ORDER BY instance_type,time desc
                                                        `,
                                    "Q-E04-nodesByMarketType" : 
                                                        `
                                                        WITH vw_nodes AS (
                                                            SELECT BIN(time, 1m ) as time,cluster_id,instance_id,market_type
                                                            FROM emrdb.cpu
                                                            WHERE time between ago({period}) and now()
                                                            GROUP BY BIN(time, 1m ),cluster_id,instance_id,market_type
                                                        )
                                                        SELECT time,market_type, count(*) as total
                                                        FROM vw_nodes
                                                        GROUP BY time,market_type
                                                        ORDER BY market_type,time desc
                                                        `,
                                    "Q-E05-clusterHostSummary" : 
                                                        `
                                                        WITH vw_cpu AS (
                                                            SELECT 
                                                                BIN(time, 10s ) as time,
                                                                AVG(100-usage_idle) as cpu_usage_avg, 
                                                                MAX(100-usage_idle) as cpu_usage_max, 
                                                                MIN(100-usage_idle) as cpu_usage_min
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE 
                                                                time between ago({period}) and now()
                                                            GROUP BY 
                                                                BIN(time, 10s )
                                                        ),
                                                        vw_memory AS (
                                                            SELECT 
                                                                BIN(time, 10s ) as time,
                                                                AVG(used_percent) as memory_usage_avg, 
                                                                MAX(used_percent) as memory_usage_max, 
                                                                MIN(used_percent) as memory_usage_min
                                                            FROM 
                                                                emrdb.memory
                                                            WHERE 
                                                                time between ago({period}) and now() 
                                                            GROUP BY 
                                                                BIN(time, 10s )
                                                        ),
                                                        vw_disk_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    cluster_id,
                                                                    instance_id,
                                                                    SUM(read_bytes_rate) as read_bytes,
                                                                    SUM(write_bytes_rate) as write_bytes, 
                                                                    SUM(reads_rate) as io_reads, 
                                                                    SUM(writes_rate) as io_writes
                                                            FROM 
                                                                    emrdb.disk
                                                            WHERE 
                                                                    time between ago({period}) and now()
                                                            GROUP BY 
                                                                    time,
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_disk_level_2 AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    cluster_id,
                                                                    instance_id,
                                                                    AVG(read_bytes) as read_bytes,
                                                                    AVG(write_bytes) as write_bytes,
                                                                    AVG(io_reads) as io_reads,
                                                                    AVG(io_writes) as io_writes
                                                            FROM 
                                                                    vw_disk_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s ),
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_disk AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time, 
                                                                    AVG(read_bytes) as read_bytes_avg,
                                                                    AVG(write_bytes) as write_bytes_avg, 
                                                                    AVG(io_reads) as io_reads_avg, 
                                                                    AVG(io_writes) as io_writes_avg,
                                                                    MAX(read_bytes) as read_bytes_max,
                                                                    MAX(write_bytes) as write_bytes_max, 
                                                                    MAX(io_reads) as io_reads_max, 
                                                                    MAX(io_writes) as io_writes_max,
                                                                    MIN(read_bytes) as read_bytes_min,
                                                                    MIN(write_bytes) as write_bytes_min, 
                                                                    MIN(io_reads) as io_reads_min, 
                                                                    MIN(io_writes) as io_writes_min,
                                                                    SUM(read_bytes) as read_bytes_sum,
                                                                    SUM(write_bytes) as write_bytes_sum, 
                                                                    SUM(io_reads) as io_reads_sum, 
                                                                    SUM(io_writes) as io_writes_sum
                                                            FROM 
                                                                    vw_disk_level_2
                                                            GROUP BY 
                                                                    BIN(time, 10s )
                                                        ),
                                                        vw_network_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    cluster_id,
                                                                    instance_id,
                                                                    SUM(bytes_sent_rate) as bytes_sent,
                                                                    SUM(bytes_recv_rate) as bytes_recv
                                                            FROM 
                                                                    emrdb.network
                                                            WHERE 
                                                                    time between ago({period}) and now() 
                                                            GROUP BY 
                                                                    time,
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_network_level_2 AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    cluster_id,
                                                                    instance_id,
                                                                    AVG(bytes_sent) as bytes_sent,
                                                                    AVG(bytes_recv) as bytes_recv
                                                            FROM 
                                                                    vw_network_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s ),
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_network AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    AVG(bytes_sent) as bytes_sent_avg,
                                                                    MAX(bytes_sent) as bytes_sent_max,
                                                                    MIN(bytes_sent) as bytes_sent_min,
                                                                    SUM(bytes_sent) as bytes_sent_sum,
                                                                    AVG(bytes_recv) as bytes_recv_avg,
                                                                    MAX(bytes_recv) as bytes_recv_max,
                                                                    MIN(bytes_recv) as bytes_recv_min, 
                                                                    SUM(bytes_recv) as bytes_recv_sum
                                                            FROM 
                                                                    vw_network_level_2
                                                            GROUP BY 
                                                                    BIN(time, 10s )
                                                        )
                                                        SELECT
                                                            vw_cpu.time,
                                                            vw_cpu.cpu_usage_avg,
                                                            vw_cpu.cpu_usage_max,
                                                            vw_cpu.cpu_usage_min,
                                                            vw_memory.memory_usage_avg,
                                                            vw_memory.memory_usage_max,
                                                            vw_memory.memory_usage_min,
                                                            vw_disk.read_bytes_sum as disk_bytes_reads,
                                                            vw_disk.write_bytes_sum as disk_bytes_writes,
                                                            (vw_disk.read_bytes_sum + vw_disk.write_bytes_sum) as disk_bytes,
                                                            (vw_disk.read_bytes_avg + vw_disk.write_bytes_avg) as disk_bytes_avg,
                                                            (vw_disk.read_bytes_max + vw_disk.write_bytes_max) as disk_bytes_max,
                                                            (vw_disk.read_bytes_min + vw_disk.write_bytes_min) as disk_bytes_min,
                                                            vw_disk.io_reads_sum as disk_io_reads,
                                                            vw_disk.io_writes_sum as disk_io_writes,
                                                            (vw_disk.io_writes_sum + vw_disk.io_reads_sum) as disk_iops,
                                                            (vw_disk.io_writes_avg + vw_disk.io_reads_avg) as disk_iops_avg,
                                                            (vw_disk.io_writes_max + vw_disk.io_reads_max) as disk_iops_max,
                                                            (vw_disk.io_writes_min + vw_disk.io_reads_min) as disk_iops_min,
                                                            vw_network.bytes_sent_sum as network_sent_bytes,
                                                            vw_network.bytes_recv_sum as network_recv_bytes,
                                                            (vw_network.bytes_sent_sum + vw_network.bytes_recv_sum) as network_bytes,
                                                            (vw_network.bytes_sent_avg + vw_network.bytes_recv_avg) as network_bytes_avg,
                                                            (vw_network.bytes_sent_max + vw_network.bytes_recv_max) as network_bytes_max,
                                                            (vw_network.bytes_sent_min + vw_network.bytes_recv_min) as network_bytes_min
                                                        FROM 
                                                            vw_cpu, vw_memory, vw_disk, vw_network
                                                        WHERE
                                                            vw_cpu.time = vw_memory.time
                                                            and
                                                            vw_cpu.time = vw_disk.time
                                                            and
                                                            vw_cpu.time = vw_network.time
                                                        ORDER BY 
                                                            vw_cpu.time
                                                        `,
                                    "Q-E06-clusterHadoopSummary" : 
                                                        `
                                                        WITH hadoop_level_1 AS (
                                                            SELECT 
                                                                cluster_id,
                                                                MAX(time) as time,
                                                                MAX_BY(coresAvailable, time) as coresAvailable,
                                                                MAX_BY(coresAllocated, time) as coresAllocated,
                                                                MAX_BY(coresPending, time) as coresPending,
                                                                MAX_BY(coresTotal, time) as coresTotal,
                                                                MAX_BY(coresUsage, time) as coresUsage,
                                                                MAX_BY(coresReserved, time) as coresReserved,
                                                                MAX_BY(memoryAllocated, time) * 1024 * 1024 as memoryAllocated,
                                                                MAX_BY(memoryAvailable, time) * 1024 * 1024 as memoryAvailable,
                                                                MAX_BY(memoryPending, time) * 1024 * 1024 as memoryPending,
                                                                MAX_BY(memoryReserved, time) * 1024 * 1024 as memoryReserved,
                                                                MAX_BY(memoryTotal, time) * 1024 * 1024 as memoryTotal,
                                                                MAX_BY(memoryUsage, time)  as memoryUsage,
                                                                MAX_BY(appsCompleted, time) as appsCompleted,
                                                                MAX_BY(appsFailed, time) as appsFailed,
                                                                MAX_BY(appsKilled, time) as appsKilled,
                                                                MAX_BY(appsPending, time) as appsPending,
                                                                MAX_BY(appsRunning, time) as appsRunning,
                                                                MAX_BY(appsSubmitted, time) as appsSubmitted,
                                                                MAX_BY(containersAllocated, time) as containersAllocated,
                                                                MAX_BY(containersPending, time) as containersPending,
                                                                MAX_BY(containersReserved, time) as containersReserved,
                                                                MAX_BY(nodesDecommissioned, time) as nodesDecommissioned,
                                                                MAX_BY(nodesDecommissioning, time) as nodesDecommissioning,
                                                                MAX_BY(nodesActive, time) as nodesActive,
                                                                MAX_BY(nodesLost, time) as nodesLost,
                                                                MAX_BY(nodesRebooted, time) as nodesRebooted,
                                                                MAX_BY(nodesShutdown, time) as nodesShutdown,
                                                                MAX_BY(nodesTotal, time) as nodesTotal,
                                                                MAX_BY(nodesUnhealthy, time) as nodesUnhealthy
                                                            FROM 
                                                                emrdb.hadoop
                                                            WHERE 
                                                                time between ago({period}) and now()
                                                            GROUP BY 
                                                                cluster_id
                                                        )
                                                        SELECT
                                                                SUM(coresAvailable) as coresAvailable,
                                                                SUM(coresAllocated) as coresAllocated,
                                                                SUM(coresPending) as coresPending,
                                                                SUM(coresTotal) as coresTotal,
                                                                SUM(coresUsage) as coresUsage,
                                                                SUM(coresReserved) as coresReserved,
                                                                SUM(memoryAllocated)  as memoryAllocated,
                                                                SUM(memoryAvailable)  as memoryAvailable,
                                                                SUM(memoryPending)  as memoryPending,
                                                                SUM(memoryReserved)as memoryReserved,
                                                                SUM(memoryTotal) as memoryTotal,
                                                                SUM(memoryUsage)  as memoryUsage,
                                                                SUM(appsCompleted) as appsCompleted,
                                                                SUM(appsFailed) as appsFailed,
                                                                SUM(appsKilled) as appsKilled,
                                                                SUM(appsPending) as appsPending,
                                                                SUM(appsRunning) as appsRunning,
                                                                SUM(appsSubmitted) as appsSubmitted,
                                                                SUM(containersAllocated) as containersAllocated,
                                                                SUM(containersPending) as containersPending,
                                                                SUM(containersReserved) as containersReserved,
                                                                SUM(nodesDecommissioned) as nodesDecommissioned,
                                                                SUM(nodesDecommissioning) as nodesDecommissioning,
                                                                SUM(nodesActive) as nodesActive,
                                                                SUM(nodesLost) as nodesLost,
                                                                SUM(nodesRebooted) as nodesRebooted,
                                                                SUM(nodesShutdown) as nodesShutdown,
                                                                SUM(nodesTotal) as nodesTotal,
                                                                SUM(nodesUnhealthy) as nodesUnhealthy
                                                        FROM hadoop_level_1
                                                        
                                    
                                                        `,
                                    "Q-E07-NodesByTypes" : 
                                                        `
                                                            SELECT 
                                                                cluster_id, 
                                                                group_id, 
                                                                instance_type, 
                                                                instance_id, 
                                                                market_type, 
                                                                role, 
                                                                MAX(time) as time
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE 
                                                                time between ago(5m) and now() 
                                                            GROUP BY
                                                                cluster_id, 
                                                                group_id, 
                                                                instance_type, 
                                                                instance_id, 
                                                                market_type, 
                                                                role
                                                            
                                                        `,
                                "Q-E08-clusterMetricsDetails" : 
                                                        `
                                                        WITH vw_cpu AS (
                                                            SELECT 
                                                                BIN(time, 10s ) as time,
                                                                AVG(100-usage_idle) as cpu_usage_avg, 
                                                                MAX(100-usage_idle) as cpu_usage_max, 
                                                                MIN(100-usage_idle) as cpu_usage_min
                                                            FROM 
                                                                emrdb.cpu
                                                            WHERE {filter}
                                                            GROUP BY 
                                                                BIN(time, 10s )
                                                        ),
                                                        vw_memory AS (
                                                            SELECT 
                                                                BIN(time, 10s ) as time,
                                                                AVG(used_percent) as memory_usage_avg, 
                                                                MAX(used_percent) as memory_usage_max, 
                                                                MIN(used_percent) as memory_usage_min
                                                            FROM 
                                                                    emrdb.memory
                                                            WHERE {filter}
                                                            GROUP BY 
                                                                BIN(time, 10s )
                                                        ),
                                                        vw_disk_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    cluster_id,
                                                                    instance_id,
                                                                    SUM(read_bytes_rate) as read_bytes,
                                                                    SUM(write_bytes_rate) as write_bytes, 
                                                                    SUM(reads_rate) as io_reads, 
                                                                    SUM(writes_rate) as io_writes
                                                            FROM 
                                                                    emrdb.disk
                                                            WHERE {filter}
                                                            GROUP BY 
                                                                    time,
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_disk_level_2 AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    cluster_id,
                                                                    instance_id,
                                                                    AVG(read_bytes) as read_bytes,
                                                                    AVG(write_bytes) as write_bytes,
                                                                    AVG(io_reads) as io_reads,
                                                                    AVG(io_writes) as io_writes
                                                            FROM 
                                                                    vw_disk_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s ),
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_disk AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time, 
                                                                    AVG(read_bytes) as read_bytes_avg,
                                                                    AVG(write_bytes) as write_bytes_avg, 
                                                                    AVG(io_reads) as io_reads_avg, 
                                                                    AVG(io_writes) as io_writes_avg,
                                                                    MAX(read_bytes) as read_bytes_max,
                                                                    MAX(write_bytes) as write_bytes_max, 
                                                                    MAX(io_reads) as io_reads_max, 
                                                                    MAX(io_writes) as io_writes_max,
                                                                    MIN(read_bytes) as read_bytes_min,
                                                                    MIN(write_bytes) as write_bytes_min, 
                                                                    MIN(io_reads) as io_reads_min, 
                                                                    MIN(io_writes) as io_writes_min,
                                                                    SUM(read_bytes) as read_bytes_sum,
                                                                    SUM(write_bytes) as write_bytes_sum, 
                                                                    SUM(io_reads) as io_reads_sum, 
                                                                    SUM(io_writes) as io_writes_sum
                                                            FROM 
                                                                    vw_disk_level_2
                                                            GROUP BY 
                                                                    BIN(time, 10s )
                                                        ),
                                                        vw_network_level_1 AS (
                                                            SELECT 
                                                                    time, 
                                                                    cluster_id,
                                                                    instance_id,
                                                                    SUM(bytes_sent_rate) as bytes_sent,
                                                                    SUM(bytes_recv_rate) as bytes_recv
                                                            FROM 
                                                                    emrdb.network
                                                            WHERE {filter}
                                                            GROUP BY 
                                                                    time,
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_network_level_2 AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    cluster_id,
                                                                    instance_id,
                                                                    AVG(bytes_sent) as bytes_sent,
                                                                    AVG(bytes_recv) as bytes_recv
                                                            FROM 
                                                                    vw_network_level_1
                                                            GROUP BY 
                                                                    BIN(time, 10s ),
                                                                    cluster_id,
                                                                    instance_id
                                                        ),
                                                        vw_network AS (
                                                            SELECT 
                                                                    BIN(time, 10s ) as time,
                                                                    AVG(bytes_sent) as bytes_sent_avg,
                                                                    MAX(bytes_sent) as bytes_sent_max,
                                                                    MIN(bytes_sent) as bytes_sent_min,
                                                                    SUM(bytes_sent) as bytes_sent_sum,
                                                                    AVG(bytes_recv) as bytes_recv_avg,
                                                                    MAX(bytes_recv) as bytes_recv_max,
                                                                    MIN(bytes_recv) as bytes_recv_min, 
                                                                    SUM(bytes_recv) as bytes_recv_sum
                                                            FROM 
                                                                    vw_network_level_2
                                                            GROUP BY 
                                                                    BIN(time, 10s )
                                                        )
                                                        SELECT
                                                            vw_cpu.time,
                                                            vw_cpu.cpu_usage_avg,
                                                            vw_cpu.cpu_usage_max,
                                                            vw_cpu.cpu_usage_min,
                                                            vw_memory.memory_usage_avg,
                                                            vw_memory.memory_usage_max,
                                                            vw_memory.memory_usage_min,
                                                            vw_disk.read_bytes_sum as disk_bytes_reads,
                                                            vw_disk.write_bytes_sum as disk_bytes_writes,
                                                            (vw_disk.read_bytes_sum + vw_disk.write_bytes_sum) as disk_bytes,
                                                            (vw_disk.read_bytes_avg + vw_disk.write_bytes_avg) as disk_bytes_avg,
                                                            (vw_disk.read_bytes_max + vw_disk.write_bytes_max) as disk_bytes_max,
                                                            (vw_disk.read_bytes_min + vw_disk.write_bytes_min) as disk_bytes_min,
                                                            vw_disk.io_reads_sum as disk_io_reads,
                                                            vw_disk.io_writes_sum as disk_io_writes,
                                                            (vw_disk.io_writes_sum + vw_disk.io_reads_sum) as disk_iops,
                                                            (vw_disk.io_writes_avg + vw_disk.io_reads_avg) as disk_iops_avg,
                                                            (vw_disk.io_writes_max + vw_disk.io_reads_max) as disk_iops_max,
                                                            (vw_disk.io_writes_min + vw_disk.io_reads_min) as disk_iops_min,
                                                            vw_network.bytes_sent_sum as network_sent_bytes,
                                                            vw_network.bytes_recv_sum as network_recv_bytes,
                                                            (vw_network.bytes_sent_sum + vw_network.bytes_recv_sum) as network_bytes,
                                                            (vw_network.bytes_sent_avg + vw_network.bytes_recv_avg) as network_bytes_avg,
                                                            (vw_network.bytes_sent_max + vw_network.bytes_recv_max) as network_bytes_max,
                                                            (vw_network.bytes_sent_min + vw_network.bytes_recv_min) as network_bytes_min
                                                        FROM 
                                                            vw_cpu, vw_memory, vw_disk, vw_network
                                                        WHERE
                                                            vw_cpu.time = vw_memory.time
                                                            and
                                                            vw_cpu.time = vw_disk.time
                                                            and
                                                            vw_cpu.time = vw_network.time
                                                        ORDER BY 
                                                            vw_cpu.time
                                                        `
                            },
                            
            }
};
