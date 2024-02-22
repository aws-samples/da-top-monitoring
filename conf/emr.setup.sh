#!/bin/bash

CLUSTERID=$(cat /mnt/var/lib/info/extraInstanceData.json | grep jobFlowId | awk -F\" '{print $4}')
GROUPID=$(cat /mnt/var/lib/info/extraInstanceData.json | grep instanceGroupId | awk -F\" '{print $4}')
ROLE=$(cat /mnt/var/lib/info/extraInstanceData.json | grep instanceRole | awk -F\" '{print $4}')
REGION=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/dynamic/instance-identity/document |grep region|awk -F\" '{print $4}' `
MARKET_TYPE=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-life-cycle`
INSTANCE_AZ=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone`
INSTANCE_ID=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id`
INSTANCE_TYPE=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-type`
PUBLIC_IP=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4`
PRIVATE_IP=`curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/local-ipv4`
VCPU=$(aws ec2 describe-instance-types --instance-types $INSTANCE_TYPE  --output text --query 'InstanceTypes[*].{ cpu: VCpuInfo.DefaultVCpus}')



sudo yum install https://repos.influxdata.com/stable/x86_64/main/telegraf-1.29.4-1.x86_64.rpm -y
cd /etc/telegraf


cat <<EOF | sudo tee /etc/telegraf/telegraf.conf
#V2024.02.09.20.28
[global_tags]
    cluster_id = "$CLUSTERID"
    group_id = "$GROUPID"
    role = "$ROLE"
    market_type = "$MARKET_TYPE"
    instance_type = "$INSTANCE_TYPE"
    region = "$REGION"
    az = "$INSTANCE_AZ"
    instance_id = "$INSTANCE_ID"
    public_ip = "$PUBLIC_IP"
    private_ip = "$PRIVATE_IP"
    total_vcpu = "$VCPU"

[agent]
  interval = "5s"
  
[[outputs.timestream]]
    namepass = ["network","disk","cpu","memory","hadoop"]
    region = "us-east-1"
    database_name = "emrdb"
    describe_database_on_start = true
    mapping_mode = "multi-table"
    create_table_if_not_exists = true
    create_table_magnetic_store_retention_period_in_days = 365
    create_table_memory_store_retention_period_in_hours = 24
    use_multi_measure_records = true
    measure_name_for_multi_measure_records = "emr_measure"
    max_write_go_routines = 25
  
[[inputs.cpu]]
    percpu = false
    totalcpu = true
    collect_cpu_time = false
    core_tags = false
    tagexclude = ["cpu"]

[[inputs.mem]]
    name_override = "memory"
    fieldinclude = ["available","total", "used", "used_percent", "swap_total"]
    tagexclude = ["total_vcpu"]

[[inputs.net]]
    fieldinclude = ["bytes_*"]
    taginclude = ["interface", "cluster_id", "group_id", "role", "market_type", "instance_type", "region", "az", "instance_id", "public_ip", "private_ip"]
    tagexclude = ["total_vcpu"]

[[inputs.diskio]]
    fieldinclude = ["*_bytes", "reads", "writes","*_time"]
    taginclude = ["name", "cluster_id", "group_id", "role", "market_type", "instance_type", "region", "az", "instance_id", "public_ip", "private_ip"]
    tagexclude = ["total_vcpu"]

[[aggregators.derivative]]
    name_override = "network"
    period = "5s"
    fieldinclude = ["bytes_*"]

[[aggregators.derivative]]
    name_override = "disk"
    period = "5s"
    fieldinclude = ["*_bytes","reads","writes","*_time"]

 
EOF

if [ "$ROLE" == "master" ]; then
cat <<EOF | sudo tee -a /etc/telegraf/telegraf.conf
[[inputs.httpjson]]
  name_override = "hadoop"
  servers = ["http://$HOSTNAME:8088/ws/v1/cluster/metrics"]
  response_timeout = "5s"
  method = "GET"
  tagexclude = ["host","server", "total_vcpu"]
  fieldinclude = ["clusterMetrics_activeNodes",                  
                  "clusterMetrics_allocatedMB",
                  "clusterMetrics_allocatedVirtualCores",
                  "clusterMetrics_appsCompleted",
                  "clusterMetrics_appsFailed",
                  "clusterMetrics_appsKilled",
                  "clusterMetrics_appsPending",
                  "clusterMetrics_appsRunning",
                  "clusterMetrics_appsSubmitted",
                  "clusterMetrics_availableMB",
                  "clusterMetrics_availableVirtualCores",
                  "clusterMetrics_containersAllocated",
                  "clusterMetrics_containersPending",
                  "clusterMetrics_containersReserved",
                  "clusterMetrics_decommissionedNodes",
                  "clusterMetrics_decommissioningNodes",
                  "clusterMetrics_lostNodes",
                  "clusterMetrics_pendingMB",
                  "clusterMetrics_pendingVirtualCores",
                  "clusterMetrics_rebootedNodes",
                  "clusterMetrics_reservedMB",
                  "clusterMetrics_reservedVirtualCores",
                  "clusterMetrics_shutdownNodes",
                  "clusterMetrics_totalMB",
                  "clusterMetrics_totalNodes",
                  "clusterMetrics_totalVirtualCores",
                  "clusterMetrics_unhealthyNodes",
                  "clusterMetrics_utilizedMBPercent",
                  "clusterMetrics_utilizedVirtualCoresPercent"
                ]
  
  

[[processors.rename]]
  namepass = ["hadoop"]
  
  [[processors.rename.replace]]
    field = "clusterMetrics_availableVirtualCores"
    dest = "coresAvailable"

  [[processors.rename.replace]]
    field = "clusterMetrics_allocatedVirtualCores"
    dest = "coresAllocated"              

  [[processors.rename.replace]]
    field = "clusterMetrics_pendingVirtualCores"
    dest = "coresPending"              

    [[processors.rename.replace]]
    field = "clusterMetrics_totalVirtualCores"
    dest = "coresTotal"              

  [[processors.rename.replace]]
    field = "clusterMetrics_utilizedVirtualCoresPercent"
    dest = "coresUsage"                  

  [[processors.rename.replace]]
    field = "clusterMetrics_reservedVirtualCores"
    dest = "coresReserved"              

  [[processors.rename.replace]]
    field = "clusterMetrics_activeNodes"                
    dest = "nodesActive"

  [[processors.rename.replace]]
    field = "clusterMetrics_allocatedMB"
    dest = "memoryAllocated"
    
  [[processors.rename.replace]]
    field = "clusterMetrics_availableMB"
    dest = "memoryAvailable"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_pendingMB"
    dest = "memoryPending"       

  [[processors.rename.replace]]
    field = "clusterMetrics_reservedMB"
    dest = "memoryReserved"              

  [[processors.rename.replace]]
    field = "clusterMetrics_totalMB"
    dest = "memoryTotal"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_utilizedMBPercent"
    dest = "memoryUsage"              

  [[processors.rename.replace]]
    field = "clusterMetrics_appsCompleted"
    dest = "appsCompleted"
    
  [[processors.rename.replace]]
    field = "clusterMetrics_appsFailed"
    dest = "appsFailed"        
    
  [[processors.rename.replace]]
    field = "clusterMetrics_appsKilled"
    dest = "appsKilled"
    
  [[processors.rename.replace]]
    field = "clusterMetrics_appsPending"
    dest = "appsPending"
    
  [[processors.rename.replace]]
    field = "clusterMetrics_appsRunning"
    dest = "appsRunning"
        
  [[processors.rename.replace]]
    field = "clusterMetrics_appsSubmitted"
    dest = "appsSubmitted"
    
  [[processors.rename.replace]]
    field = "clusterMetrics_containersAllocated"
    dest = "containersAllocated"          
    
  [[processors.rename.replace]]
    field = "clusterMetrics_containersPending"
    dest = "containersPending"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_containersReserved"
    dest = "containersReserved"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_decommissionedNodes"
    dest = "nodesDecommissioned"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_decommissioningNodes"
    dest = "nodesDecommissioning"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_lostNodes"
    dest = "nodesLost"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_rebootedNodes"
    dest = "nodesRebooted"

  [[processors.rename.replace]]
    field = "clusterMetrics_shutdownNodes"
    dest = "nodesShutdown"              
    
  [[processors.rename.replace]]
    field = "clusterMetrics_totalNodes"
    dest = "nodesTotal"              

  [[processors.rename.replace]]
    field = "clusterMetrics_unhealthyNodes"
    dest = "nodesUnhealthy"              

EOF

fi

sudo service telegraf restart

